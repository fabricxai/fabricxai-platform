'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Rfq {
  id: string;
  company_id: string;
  buyer_id: string | null;
  title: string;
  product_type: string | null;
  description: string | null;
  quantity: number | null;
  unit: string;
  target_price: number | null;
  currency: string;
  deadline: string | null;
  status: 'open' | 'quoted' | 'won' | 'lost' | 'cancelled';
  source: 'manual' | 'ai_extracted';
  is_demo: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  buyer?: { company_name: string } | null;
}

/** Delete all demo-flagged rows for the company (RLS-scoped). */
export async function clearDemoData() {
  const supabase = createClient();
  // quotes first (FK to rfqs), then rfqs, then buyers.
  await supabase.from('quotes').delete().eq('is_demo', true);
  await supabase.from('rfqs').delete().eq('is_demo', true);
  await supabase.from('buyers').delete().eq('is_demo', true);
}

export interface Quote {
  id: string;
  rfq_id: string;
  version: number;
  currency: string;
  material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  freight_cost: number;
  margin_pct: number;
  fob_price: number;
  lead_time_days: number | null;
  moq: number | null;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  source: 'manual' | 'marbim';
  created_at: string;
}

const RFQ_SELECT = '*, buyer:buyers(company_name)';

/** Live list of the company's RFQs (RLS-scoped), newest first. */
export function useRfqs() {
  const [data, setData] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data: rows, error: err } = await supabase
      .from('rfqs')
      .select(RFQ_SELECT)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else {
      setData((rows as unknown as Rfq[]) ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

/** A single RFQ with its quotes. */
export function useRfq(id: string | null) {
  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) return;
    const supabase = createClient();
    setLoading(true);
    const [{ data: r }, { data: q }] = await Promise.all([
      supabase.from('rfqs').select(RFQ_SELECT).eq('id', id).single(),
      supabase.from('quotes').select('*').eq('rfq_id', id).order('version', { ascending: false }),
    ]);
    setRfq((r as unknown as Rfq) ?? null);
    setQuotes((q as Quote[]) ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rfq, quotes, loading, refresh };
}
