/** Verify Anthropic quote drafting + FOB engine. node --env-file=.env.local scripts/smoke-quote.mjs */
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const schema = z.object({
  material_cost: z.number(), labor_cost: z.number(), overhead_cost: z.number(),
  freight_cost: z.number(), margin_pct: z.number(),
  lead_time_days: z.number().int().nullable(), moq: z.number().int().nullable(),
  rationale: z.string(),
});

const rfq = { title: '12,000 denim jackets', product_type: 'denim jacket', quantity: 12000, target_price: 18.5, currency: 'USD', description: '12oz denim, washed, metal trims, S-XL' };

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema,
  prompt: `Bangladesh garment factory costing expert. Per-unit cost breakdown + margin in ${rfq.currency}. RFQ: ${rfq.title}, product ${rfq.product_type}, qty ${rfq.quantity}, target ${rfq.target_price}, specs ${rfq.description}. Keep FOB near or below target.`,
});
const total = object.material_cost + object.labor_cost + object.overhead_cost + object.freight_cost;
const fob = Math.round((total / (1 - object.margin_pct / 100)) * 100) / 100;
console.log(JSON.stringify(object, null, 2));
console.log(`\nENGINE: total=$${total.toFixed(2)} margin=${object.margin_pct}% → FOB=$${fob} (target $${rfq.target_price})`);
