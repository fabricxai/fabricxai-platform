'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Clarification {
  id: string;
  rfq_id: string;
  question: string;
  answer: string | null;
  status: 'open' | 'answered';
  created_at: string;
  rfq?: { title: string; buyer?: { company_name: string } | null } | null;
}

/** Live list of the company's RFQ clarifications (RLS-scoped). */
export function useClarifications() {
  const [data, setData] = useState<Clarification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data: rows } = await supabase
      .from('rfq_clarifications')
      .select('*, rfq:rfqs(title, buyer:buyers(company_name))')
      .order('created_at', { ascending: false });
    setData((rows as unknown as Clarification[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
