import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Public "Request demo access" submissions from the login page (no session).
 * Writes with the service role so RLS never exposes these to anyone else.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const companyName = String(body.companyName ?? '').trim();
  const email = String(body.email ?? '').trim();

  if (!companyName || !email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Company name and a valid work email are required.' },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('demo_requests').insert({
    company_name: companyName,
    contact_name: String(body.contactName ?? '').trim() || null,
    email,
    phone: String(body.phone ?? '').trim() || null,
    country: String(body.country ?? '').trim() || null,
    company_size: String(body.companySize ?? '').trim() || null,
    message: String(body.message ?? '').trim() || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
