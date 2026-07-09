import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  tool,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { models } from '@/lib/ai/models';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { extractRfq } from '@/lib/ai/extract';
import { draftQuoteForRfq } from '@/lib/ai/quote';

export const maxDuration = 60;

/**
 * MARBIM streaming agent. The UI consumes this with useChat from @ai-sdk/react.
 * Tools run with the caller's Supabase session, so RLS scopes everything to the
 * user's company. Write-tools never touch module tables directly — they create
 * pending_changes drafts that the human approves.
 */
export async function POST(req: Request) {
  const auth = await getCurrentProfile();
  if (!auth) return new Response('Unauthorized', { status: 401 });
  const supabase = await createClient();

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: models.reasoning,
    system:
      'You are MARBIM, the copilot inside FabricXAI — an AI ERP for garment factories. ' +
      'Help the user manage RFQs, quotes, buyers, production and more. ' +
      'You never write records directly: when the user wants to create or change something, ' +
      'use a draft tool that queues it for their approval, then tell them to review it in the ' +
      'Approve inbox. Be concise and concrete. Today is ' +
      new Date().toISOString().slice(0, 10) + '.',
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(8),
    tools: {
      listRfqs: tool({
        description: 'List the company\'s RFQs, optionally filtered by status.',
        inputSchema: z.object({
          status: z.enum(['open', 'quoted', 'won', 'lost', 'cancelled']).nullable(),
        }),
        execute: async ({ status }) => {
          let q = supabase
            .from('rfqs')
            .select('id, title, product_type, quantity, target_price, currency, status')
            .order('created_at', { ascending: false })
            .limit(25);
          if (status) q = q.eq('status', status);
          const { data, error } = await q;
          return error ? { error: error.message } : { rfqs: data };
        },
      }),
      getRfq: tool({
        description: 'Get one RFQ with its quotes by id.',
        inputSchema: z.object({ rfqId: z.string() }),
        execute: async ({ rfqId }) => {
          const { data: rfq } = await supabase.from('rfqs').select('*').eq('id', rfqId).single();
          const { data: quotes } = await supabase
            .from('quotes')
            .select('*')
            .eq('rfq_id', rfqId)
            .order('version', { ascending: false });
          return { rfq, quotes };
        },
      }),
      draftRfqFromText: tool({
        description:
          'Extract an RFQ from pasted buyer text and queue it as a draft for the user to approve.',
        inputSchema: z.object({ text: z.string() }),
        execute: async ({ text }) => {
          const extracted = await extractRfq(text);
          const { data, error } = await supabase
            .from('pending_changes')
            .insert({
              company_id: auth.profile.company_id,
              module: 'rfq',
              action: 'create',
              target_table: 'rfqs',
              payload: {
                title: extracted.title,
                product_type: extracted.productType,
                description: extracted.description,
                quantity: extracted.quantity,
                unit: extracted.unit ?? 'pcs',
                target_price: extracted.targetPrice,
                currency: extracted.currency ?? 'USD',
                deadline: extracted.deadline,
                source: 'ai_extracted',
              },
              summary: `New RFQ: ${extracted.title}`,
              ai_confidence: 0.85,
              source: 'marbim',
              created_by: auth.user.id,
            })
            .select('id')
            .single();
          return error
            ? { error: error.message }
            : { queued: true, pendingChangeId: data.id, extracted };
        },
      }),
      draftQuote: tool({
        description:
          'Draft a priced quotation for an RFQ (FOB computed by the engine) and queue it for approval.',
        inputSchema: z.object({ rfqId: z.string() }),
        execute: async ({ rfqId }) => {
          const { data: rfq } = await supabase.from('rfqs').select('*').eq('id', rfqId).single();
          if (!rfq) return { error: 'RFQ not found' };
          const draft = await draftQuoteForRfq(rfq);
          const { data, error } = await supabase
            .from('pending_changes')
            .insert({
              company_id: auth.profile.company_id,
              module: 'rfq',
              action: 'create',
              target_table: 'quotes',
              payload: {
                rfq_id: rfq.id,
                version: 1,
                currency: rfq.currency,
                material_cost: draft.material_cost,
                labor_cost: draft.labor_cost,
                overhead_cost: draft.overhead_cost,
                freight_cost: draft.freight_cost,
                margin_pct: draft.margin_pct,
                fob_price: draft.fob_price,
                lead_time_days: draft.lead_time_days,
                moq: draft.moq,
                status: 'draft',
                source: 'marbim',
              },
              summary: `Quote for ${rfq.title}: FOB ${rfq.currency} ${draft.fob_price} @ ${draft.margin_pct}%`,
              ai_confidence: 0.8,
              source: 'marbim',
              created_by: auth.user.id,
            })
            .select('id')
            .single();
          return error ? { error: error.message } : { queued: true, pendingChangeId: data.id, draft };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
