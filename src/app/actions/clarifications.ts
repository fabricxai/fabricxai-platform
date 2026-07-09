'use server';

import { createClient, getCurrentProfile } from '@/lib/supabase/server';

type Result = { ok: true } | { ok: false; error: string };

/** Raise a clarification question against an RFQ. */
export async function createClarification(rfqId: string, question: string): Promise<Result> {
  const auth = await getCurrentProfile();
  if (!auth) return { ok: false, error: 'Not authenticated' };
  if (!rfqId || !question.trim()) return { ok: false, error: 'RFQ and question are required' };

  const supabase = await createClient();
  const { error } = await supabase.from('rfq_clarifications').insert({
    company_id: auth.profile.company_id,
    rfq_id: rfqId,
    question: question.trim(),
    raised_by: auth.user.id,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Answer (resolve) a clarification. */
export async function answerClarification(id: string, answer: string): Promise<Result> {
  const auth = await getCurrentProfile();
  if (!auth) return { ok: false, error: 'Not authenticated' };
  const supabase = await createClient();
  const { error } = await supabase
    .from('rfq_clarifications')
    .update({ answer: answer.trim() || null, status: 'answered' })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
