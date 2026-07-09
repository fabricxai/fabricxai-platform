'use server';

import { revalidatePath } from 'next/cache';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * The commit half of propose → approve → commit.
 * Approving a pending_change writes the drafted payload to its target_table
 * (create/update/delete), stamped with the company, then marks it approved.
 * Everything runs as the signed-in user, so RLS guarantees tenant isolation.
 *
 * Per-module Zod validation of `payload` is layered on in each module's wave;
 * this generic commit is the shared spine.
 */
export async function approvePendingChange(id: string): Promise<ActionResult> {
  const auth = await getCurrentProfile();
  if (!auth) return { ok: false, error: 'Not authenticated' };
  const supabase = await createClient();

  const { data: change, error: readErr } = await supabase
    .from('pending_changes')
    .select('*')
    .eq('id', id)
    .single();
  if (readErr || !change) return { ok: false, error: readErr?.message ?? 'Change not found' };
  if (change.status !== 'pending') return { ok: false, error: 'Already reviewed' };

  const payload = { ...(change.payload as Record<string, unknown>) };

  try {
    if (change.action === 'create') {
      const { error } = await supabase
        .from(change.target_table)
        .insert({ ...payload, company_id: auth.profile.company_id, created_by: auth.user.id });
      if (error) throw error;
    } else if (change.action === 'update') {
      if (!change.target_id) throw new Error('Missing target_id for update');
      const { error } = await supabase
        .from(change.target_table)
        .update(payload)
        .eq('id', change.target_id);
      if (error) throw error;
    } else if (change.action === 'delete') {
      if (!change.target_id) throw new Error('Missing target_id for delete');
      const { error } = await supabase
        .from(change.target_table)
        .delete()
        .eq('id', change.target_id);
      if (error) throw error;
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Commit failed' };
  }

  const { error: markErr } = await supabase
    .from('pending_changes')
    .update({ status: 'approved', reviewed_by: auth.user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (markErr) return { ok: false, error: markErr.message };

  revalidatePath('/approve');
  return { ok: true };
}

export async function rejectPendingChange(id: string, reason?: string): Promise<ActionResult> {
  const auth = await getCurrentProfile();
  if (!auth) return { ok: false, error: 'Not authenticated' };
  const supabase = await createClient();

  const { error } = await supabase
    .from('pending_changes')
    .update({
      status: 'rejected',
      reject_reason: reason ?? null,
      reviewed_by: auth.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'pending');
  if (error) return { ok: false, error: error.message };

  revalidatePath('/approve');
  return { ok: true };
}
