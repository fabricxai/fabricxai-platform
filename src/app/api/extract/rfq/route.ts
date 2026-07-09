import { NextResponse } from 'next/server';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { extractRfq } from '@/lib/ai/extract';

export const maxDuration = 60;

/**
 * MARBIM extraction endpoint for RFQs.
 * Body: { text: string }  (a buyer email / pasted spec / OCR'd PDF text)
 * → Gemini extracts structured fields → we write a pending_changes DRAFT
 * (never a live rfqs row). The Approve inbox commits it after human review.
 */
export async function POST(req: Request) {
  const auth = await getCurrentProfile();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { text } = await req.json().catch(() => ({ text: '' }));
  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return NextResponse.json({ error: 'Provide the RFQ text to extract.' }, { status: 400 });
  }

  let extracted;
  try {
    extracted = await extractRfq(text);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Extraction failed' },
      { status: 502 },
    );
  }

  const supabase = await createClient();

  // Try to link an existing buyer by name (does not create one — that's its own flow).
  let buyerId: string | null = null;
  if (extracted.buyerCompanyName) {
    const { data: buyer } = await supabase
      .from('buyers')
      .select('id')
      .ilike('company_name', extracted.buyerCompanyName)
      .limit(1)
      .maybeSingle();
    buyerId = buyer?.id ?? null;
  }

  // The drafted rfqs row (company_id/created_by are stamped on commit).
  const payload = {
    buyer_id: buyerId,
    title: extracted.title,
    product_type: extracted.productType,
    description: extracted.description,
    quantity: extracted.quantity,
    unit: extracted.unit ?? 'pcs',
    target_price: extracted.targetPrice,
    currency: extracted.currency ?? 'USD',
    deadline: extracted.deadline,
    notes: extracted.notes,
    source: 'ai_extracted',
  };

  // Confidence heuristic: fraction of core fields the model actually filled.
  const core = [
    extracted.title,
    extracted.productType,
    extracted.quantity,
    extracted.targetPrice,
    extracted.deadline,
    extracted.description,
  ];
  const confidence =
    Math.round((core.filter((v) => v !== null && v !== undefined && v !== '').length / core.length) * 100) / 100;

  const { data: change, error } = await supabase
    .from('pending_changes')
    .insert({
      company_id: auth.profile.company_id,
      module: 'rfq',
      action: 'create',
      target_table: 'rfqs',
      payload,
      summary: `New RFQ: ${extracted.title}${extracted.quantity ? ` (${extracted.quantity} ${payload.unit})` : ''}`,
      ai_confidence: confidence,
      source: 'extract',
      created_by: auth.user.id,
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ pendingChange: change, extracted });
}
