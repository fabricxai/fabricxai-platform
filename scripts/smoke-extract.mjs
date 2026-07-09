/**
 * Verify the Gemini extraction path end-to-end (key + model + schema).
 * Run: node --env-file=.env.local scripts/smoke-extract.mjs
 */
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  buyerCompanyName: z.string().nullable(),
  productType: z.string().nullable(),
  quantity: z.number().int().nullable(),
  unit: z.string().nullable(),
  targetPrice: z.number().nullable(),
  currency: z.string().nullable(),
  deadline: z.string().nullable(),
  description: z.string().nullable(),
  notes: z.string().nullable(),
});

const sample = `Hi, this is Erik from H&M sourcing. We'd like a quotation for 5,000
organic cotton t-shirts, 180 GSM, 4 colors, sizes S to XXL, OEKO-TEX certified.
Target price around $4.20 per piece FOB. We need delivery by mid September 2026.
Please confirm MOQ and lead time. Thanks, Erik`;

const { object } = await generateObject({
  model: google('gemini-2.5-flash'),
  schema,
  prompt: `Extract RFQ details. Use null for missing fields. Today is 2026-07-09.\n\n${sample}`,
});

console.log(JSON.stringify(object, null, 2));
