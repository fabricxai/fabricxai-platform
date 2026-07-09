/**
 * Verify the propose→approve→commit loop AS THE REAL USER (RLS enforced).
 * Mirrors exactly what the extract route + approvePendingChange server action do.
 * Run: node --env-file=.env.local scripts/smoke-loop.mjs
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: auth, error: authErr } = await sb.auth.signInWithPassword({
  email: 'kamrul.sociofi@gmail.com',
  password: 'K381654729@mk',
});
if (authErr) throw new Error('sign-in failed: ' + authErr.message);
console.log('1. signed in as', auth.user.email);

const { data: profile } = await sb.from('profiles').select('id, company_id').single();

// (extract) — MARBIM writes a DRAFT, not a live row.
const payload = {
  title: 'SMOKE loop tee', product_type: 't-shirt', quantity: 1234,
  unit: 'pcs', target_price: 3.9, currency: 'USD', source: 'ai_extracted',
};
const { data: pc, error: pcErr } = await sb.from('pending_changes').insert({
  company_id: profile.company_id, module: 'rfq', action: 'create', target_table: 'rfqs',
  payload, summary: 'SMOKE loop', ai_confidence: 0.9, source: 'extract', created_by: profile.id,
}).select().single();
if (pcErr) throw new Error('pending insert failed (RLS?): ' + pcErr.message);
console.log('2. draft in pending_changes:', pc.id);

// (approve) — commit the payload to rfqs, then mark approved. Same as the server action.
const { data: rfq, error: rfqErr } = await sb.from('rfqs')
  .insert({ ...payload, company_id: profile.company_id, created_by: profile.id })
  .select().single();
if (rfqErr) throw new Error('commit to rfqs failed (RLS?): ' + rfqErr.message);
await sb.from('pending_changes').update({ status: 'approved', reviewed_by: profile.id }).eq('id', pc.id);
console.log('3. committed real rfq:', rfq.id, '→', rfq.title);

// (verify) — the RFQ is now visible to the user via RLS.
const { data: check } = await sb.from('rfqs').select('title, status').eq('id', rfq.id).single();
console.log('4. visible in inbox:', JSON.stringify(check));

// cleanup
await sb.from('rfqs').delete().eq('id', rfq.id);
await sb.from('pending_changes').delete().eq('id', pc.id);
console.log('5. cleaned up. LOOP OK ✅');
