/**
 * Supabase configuration — sourced ONLY from environment variables.
 * (Legacy hardcoded project fallbacks were removed 2026-07-09; the app now
 * fails loudly if env is missing instead of silently hitting a stale project.)
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PROJECT_ID
 */

export const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ?? '';

export const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (projectId ? `https://${projectId}.supabase.co` : '');

export function getSupabaseUrl(): string {
  return supabaseUrl;
}
