/** Verify MARBIM uses tools + real data. node --env-file=.env.local scripts/smoke-marbim.mjs */
import { generateText, stepCountIs, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { text } = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  system: 'You are MARBIM, the FabricXAI garment-ERP copilot. Use tools to read real data. Be concise.',
  messages: [{ role: 'user', content: 'What RFQs do we have open, and which buyer is the biggest by quantity?' }],
  stopWhen: stepCountIs(5),
  tools: {
    listRfqs: tool({
      description: "List the company's RFQs.",
      inputSchema: z.object({ status: z.enum(['open', 'quoted', 'won', 'lost', 'cancelled']).nullable() }),
      execute: async ({ status }) => {
        let q = sb.from('rfqs').select('title, quantity, target_price, currency, status, buyer:buyers(company_name)').limit(25);
        if (status) q = q.eq('status', status);
        const { data, error } = await q;
        return error ? { error: error.message } : { rfqs: data };
      },
    }),
  },
});

console.log(text);
