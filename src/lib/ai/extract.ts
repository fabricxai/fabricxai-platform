import { generateObject } from 'ai';
import { z } from 'zod';
import { models } from './models';

/**
 * Agentic data input, pattern #1: structured extraction.
 * Give it unstructured text (a buyer email, a WhatsApp message, a pasted spec
 * sheet, OCR'd PDF) and get back a typed object that pre-fills a form for human
 * review — the user confirms/edits instead of typing everything.
 *
 * Each module adds its own schema + extract fn here. RFQ is the flagship.
 */

export const rfqExtractionSchema = z.object({
  title: z.string().describe("Short label, e.g. '5,000 organic cotton tees'"),
  buyerCompanyName: z.string().nullable().describe('Buyer company the request came from, if mentioned'),
  productType: z.string().nullable().describe('e.g. knitwear, denim, t-shirt'),
  quantity: z.number().int().nullable(),
  unit: z.string().nullable().describe('pcs, dozens, sets…'),
  targetPrice: z.number().nullable().describe('Target unit price if given'),
  currency: z.string().nullable().describe('ISO code like USD, EUR'),
  deadline: z.string().nullable().describe('Delivery/quote deadline as YYYY-MM-DD if determinable'),
  description: z.string().nullable().describe('Specs: fabric, GSM, colors, sizes…'),
  notes: z.string().nullable().describe('Anything else relevant'),
});

export type RfqExtraction = z.infer<typeof rfqExtractionSchema>;

export async function extractRfq(rawText: string): Promise<RfqExtraction> {
  const today = new Date().toISOString().slice(0, 10);
  const { object } = await generateObject({
    model: models.fast,
    schema: rfqExtractionSchema,
    prompt:
      `Extract request-for-quotation details from the text below. ` +
      `Use null for anything not present. Today is ${today}.\n\n${rawText}`,
  });
  return object;
}
