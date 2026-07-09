import { NextResponse } from 'next/server';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { draftQuoteForRfq } from '@/lib/ai/quote';

export const maxDuration = 60;

/**
 * MARBIM drafts a quotation for an RFQ.
 * Body: { rfqId }. Writes a pending_changes DRAFT for the `quotes` table
 * (FOB computed by the engine) — the Approve inbox commits it.
 */
export async function POST(req: Request) {
  const auth = await getCurrentProfile();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rfqId } = await req.json().catch(() => ({}));
  if (!rfqId) return NextResponse.json({ error: 'rfqId required' }, { status: 400 });

  const supabase = await createClient();
  const { data: rfq, error } = await supabase.from('rfqs').select('*').eq('id', rfqId).single();
  if (error || !rfq) return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });

  let draft;
  try {
    draft = await draftQuoteForRfq(rfq);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Draft failed' },
      { status: 502 },
    );
  }

  const payload = {
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
  };

  const { data: change, error: e2 } = await supabase
    .from('pending_changes')
    .insert({
      company_id: auth.profile.company_id,
      module: 'rfq',
      action: 'create',
      target_table: 'quotes',
      payload,
      summary: `Quote for ${rfq.title}: FOB ${rfq.currency} ${draft.fob_price} @ ${draft.margin_pct}% margin`,
      ai_confidence: 0.8,
      source: 'marbim',
      created_by: auth.user.id,
    })
    .select('*')
    .single();

  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  return NextResponse.json({ pendingChange: change, draft });
}
