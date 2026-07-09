import { generateObject } from 'ai';
import { z } from 'zod';
import { models } from './models';

/**
 * MARBIM drafts a per-unit cost breakdown for an RFQ using the reasoning model.
 * IMPORTANT: the model proposes the cost COMPONENTS and a margin; the FOB price
 * is then computed by the deterministic engine — not guessed by the model.
 * "The math is real; the copilot just narrates it."
 */
export const quoteDraftSchema = z.object({
  material_cost: z.number().describe('Estimated material cost per unit'),
  labor_cost: z.number().describe('Estimated labor (cut-make-trim) cost per unit'),
  overhead_cost: z.number().describe('Factory overhead allocated per unit'),
  freight_cost: z.number().describe('Freight/logistics per unit'),
  margin_pct: z.number().describe('Recommended margin percentage, e.g. 18 for 18%'),
  lead_time_days: z.number().int().nullable().describe('Realistic lead time in days'),
  moq: z.number().int().nullable().describe('Suggested minimum order quantity'),
  rationale: z.string().describe('One or two sentences explaining the pricing logic'),
});

export type QuoteDraft = z.infer<typeof quoteDraftSchema>;

interface RfqLike {
  title: string;
  product_type: string | null;
  quantity: number | null;
  target_price: number | null;
  currency: string;
  description: string | null;
}

export async function draftQuoteForRfq(
  rfq: RfqLike,
): Promise<QuoteDraft & { fob_price: number }> {
  const { object } = await generateObject({
    model: models.reasoning,
    schema: quoteDraftSchema,
    prompt:
      `You are a Bangladesh garment factory costing expert. Draft a realistic per-unit ` +
      `cost breakdown and margin for this RFQ. All figures in ${rfq.currency} per piece.\n\n` +
      `RFQ: ${rfq.title}\n` +
      `Product: ${rfq.product_type ?? 'n/a'}\n` +
      `Quantity: ${rfq.quantity ?? 'n/a'}\n` +
      `Buyer target price: ${rfq.target_price ?? 'not given'}\n` +
      `Specs: ${rfq.description ?? 'n/a'}\n\n` +
      `Keep the resulting FOB near or slightly below the target price where one is given, ` +
      `without pushing margin unrealistically low. Material is usually the largest component.`,
  });

  // Deterministic engine — same formula as the cost-sheet math.
  const total =
    object.material_cost + object.labor_cost + object.overhead_cost + object.freight_cost;
  const fob_price = Math.round((total / (1 - object.margin_pct / 100)) * 100) / 100;

  return { ...object, fob_price };
}
