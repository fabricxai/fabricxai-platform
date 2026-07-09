/**
 * Seed demo buyers + RFQs + one quote for the FabricXAI tenant.
 * Run: node --env-file=.env.local scripts/seed-rfq.mjs
 * Idempotent-ish: skips insert if RFQs already exist for the company.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SR) throw new Error('Missing SUPABASE env');

const h = {
  apikey: SR,
  Authorization: `Bearer ${SR}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function rest(path, init = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, { ...init, headers: { ...h, ...(init.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

// Owner user + company (created via auth admin earlier).
const [profile] = await rest('profiles?select=id,company_id,email&email=eq.kamrul.sociofi@gmail.com');
if (!profile) throw new Error('Owner profile not found — create the user first.');
const companyId = profile.company_id;
const createdBy = profile.id;

const existing = await rest(`rfqs?select=id&company_id=eq.${companyId}&limit=1`);
if (existing.length) {
  console.log('RFQs already seeded for this company — nothing to do.');
  process.exit(0);
}

// Buyers
const buyers = await rest('buyers', {
  method: 'POST',
  body: JSON.stringify([
    { company_id: companyId, company_name: 'H&M', contact_name: 'Erik Lundqvist', email: 'sourcing@hm.com', country: 'Sweden', tier: 'A', status: 'active', created_by: createdBy },
    { company_id: companyId, company_name: 'Inditex (Zara)', contact_name: 'Marta Ruiz', email: 'buyers@inditex.com', country: 'Spain', tier: 'A', status: 'active', created_by: createdBy },
    { company_id: companyId, company_name: 'Uniqlo', contact_name: 'Kenji Sato', email: 'supply@uniqlo.com', country: 'Japan', tier: 'B', status: 'active', created_by: createdBy },
  ]),
});
const byName = Object.fromEntries(buyers.map((b) => [b.company_name, b.id]));

// RFQs
const rfqs = await rest('rfqs', {
  method: 'POST',
  body: JSON.stringify([
    { company_id: companyId, buyer_id: byName['H&M'], title: '5,000 organic cotton tees', product_type: 't-shirt', description: '180 GSM organic cotton, 4 colors, S–XXL, OEKO-TEX', quantity: 5000, unit: 'pcs', target_price: 4.2, currency: 'USD', deadline: '2026-09-15', status: 'open', created_by: createdBy, is_demo: true },
    { company_id: companyId, buyer_id: byName['Inditex (Zara)'], title: '12,000 denim jackets', product_type: 'denim jacket', description: '12oz denim, washed, metal trims, S–XL', quantity: 12000, unit: 'pcs', target_price: 18.5, currency: 'USD', deadline: '2026-10-01', status: 'quoted', created_by: createdBy, is_demo: true },
    { company_id: companyId, buyer_id: byName['Uniqlo'], title: '8,000 fleece hoodies', product_type: 'hoodie', description: '320 GSM brushed fleece, kangaroo pocket, 3 colors', quantity: 8000, unit: 'pcs', target_price: 9.75, currency: 'USD', deadline: '2026-09-30', status: 'open', created_by: createdBy, is_demo: true },
    { company_id: companyId, buyer_id: byName['H&M'], title: '3,000 pique polo shirts', product_type: 'polo', description: '200 GSM cotton pique, embroidered logo', quantity: 3000, unit: 'pcs', target_price: 6.4, currency: 'USD', deadline: '2026-08-20', status: 'won', created_by: createdBy, is_demo: true },
  ]),
});
const denim = rfqs.find((r) => r.title.includes('denim'));

// One quote for the denim RFQ. Engine: fob = totalCost / (1 - margin/100).
const material = 6.2, labor = 3.1, overhead = 1.4, freight = 0.9, margin = 18;
const total = material + labor + overhead + freight;
const fob = Math.round((total / (1 - margin / 100)) * 100) / 100;
const [quote] = await rest('quotes', {
  method: 'POST',
  body: JSON.stringify([{
    company_id: companyId, rfq_id: denim.id, version: 1, currency: 'USD',
    material_cost: material, labor_cost: labor, overhead_cost: overhead, freight_cost: freight,
    margin_pct: margin, fob_price: fob, lead_time_days: 75, moq: 3000, status: 'sent',
    source: 'manual', created_by: createdBy,
  }]),
});
await rest('quote_lines', {
  method: 'POST',
  body: JSON.stringify([
    { quote_id: quote.id, kind: 'material', description: '12oz denim fabric', quantity: 1.8, unit: 'yd', unit_cost: 3.44, line_total: 6.2 },
    { quote_id: quote.id, kind: 'labor', description: 'Cut-make-trim', quantity: 31, unit: 'min', unit_cost: 0.1, line_total: 3.1 },
    { quote_id: quote.id, kind: 'overhead', description: 'Factory overhead', quantity: 1, unit: 'pc', unit_cost: 1.4, line_total: 1.4 },
    { quote_id: quote.id, kind: 'freight', description: 'FOB Chittagong', quantity: 1, unit: 'pc', unit_cost: 0.9, line_total: 0.9 },
  ]),
});

console.log(`Seeded: ${buyers.length} buyers, ${rfqs.length} RFQs, 1 quote (FOB $${fob}).`);
