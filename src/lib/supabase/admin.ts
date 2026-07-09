import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — bypasses RLS. SERVER ONLY.
 * Use exclusively in route handlers / server actions for privileged writes that
 * have no user session (e.g. public demo-request submissions). Never import this
 * into client code — it would leak the service-role key.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
