'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PendingStatus = 'pending' | 'approved' | 'rejected';

export interface PendingChange {
  id: string;
  company_id: string;
  module: string;
  action: 'create' | 'update' | 'delete';
  target_table: string;
  target_id: string | null;
  payload: Record<string, unknown>;
  summary: string | null;
  ai_confidence: number | null;
  source: 'marbim' | 'extract' | 'manual';
  status: PendingStatus;
  reject_reason: string | null;
  created_by: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Live read of the company's pending changes — the data behind the Approve inbox
 * and every module's "MARBIM drafted this, review it" card. RLS scopes to company.
 */
export function usePendingChanges(status?: PendingStatus) {
  const [data, setData] = useState<PendingChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    let query = supabase
      .from('pending_changes')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data: rows, error: err } = await query;
    if (err) setError(err.message);
    else {
      setData((rows as PendingChange[]) ?? []);
      setError(null);
    }
    setLoading(false);
  }, [status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
