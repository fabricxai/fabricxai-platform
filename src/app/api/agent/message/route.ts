import { generateText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { models } from '@/lib/ai/models';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';

export const maxDuration = 60;

type ChatMsg = { role: 'user' | 'assistant'; content: string };

/**
 * Non-streaming MARBIM response for the AIAssistantPanel. Real Claude reasoning,
 * grounded in the company's data via read tools (RLS-scoped). Returns { text }.
 * Replaces the panel's former scripted generateEnhancedResponse().
 */
export async function POST(req: Request) {
  const auth = await getCurrentProfile();
  if (!auth) return Response.json({ error: 'Please sign in to use MARBIM.' }, { status: 401 });
  const supabase = await createClient();

  const { messages, module }: { messages: ChatMsg[]; module?: string } = await req.json();
  const history = (messages ?? [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-12);

  try {
    const { text } = await generateText({
      model: models.reasoning,
      system:
        'You are MARBIM, the copilot inside FabricXAI — an AI ERP for garment factories. ' +
        `The user is currently on the "${module ?? 'dashboard'}" screen. ` +
        'Answer concisely and concretely using the tools to read their real data when relevant. ' +
        'You never change records directly; if the user wants to create or update something, ' +
        'tell them to use the on-screen action so it goes through approval. ' +
        'If there is little or no data yet, say so plainly and suggest a next step. Today is ' +
        new Date().toISOString().slice(0, 10) + '.',
      messages: history,
      stopWhen: stepCountIs(6),
      tools: {
        listRfqs: tool({
          description: "List the company's RFQs, optionally filtered by status.",
          inputSchema: z.object({
            status: z.enum(['open', 'quoted', 'won', 'lost', 'cancelled']).nullable(),
          }),
          execute: async ({ status }) => {
            let q = supabase
              .from('rfqs')
              .select('title, product_type, quantity, target_price, currency, status')
              .order('created_at', { ascending: false })
              .limit(25);
            if (status) q = q.eq('status', status);
            const { data, error } = await q;
            return error ? { error: error.message } : { rfqs: data };
          },
        }),
        listBuyers: tool({
          description: "List the company's buyers.",
          inputSchema: z.object({}),
          execute: async () => {
            const { data, error } = await supabase
              .from('buyers')
              .select('company_name, country, tier, status')
              .limit(50);
            return error ? { error: error.message } : { buyers: data };
          },
        }),
        pendingApprovals: tool({
          description: 'Count and summarize items awaiting approval.',
          inputSchema: z.object({}),
          execute: async () => {
            const { data, error } = await supabase
              .from('pending_changes')
              .select('module, summary, status')
              .eq('status', 'pending')
              .limit(25);
            return error ? { error: error.message } : { pending: data };
          },
        }),
      },
    });

    return Response.json({ text });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'MARBIM had trouble responding.' },
      { status: 502 },
    );
  }
}
