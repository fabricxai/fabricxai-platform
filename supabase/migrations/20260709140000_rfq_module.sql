-- Wave 1: RFQ & Quotation module (+ minimal buyers, which RFQ references and
-- Buyer Management builds on in Wave 2). All tenant-scoped by company_id via RLS.

-- ── Buyers (minimal; extended in Wave 2) ────────────────────────────
create table public.buyers (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references public.companies on delete cascade,
  company_name      text not null,
  contact_name      text,
  email             text,
  phone             text,
  country           text,
  tier              text check (tier in ('A','B','C')),
  status            text not null default 'active' check (status in ('prospect','active','inactive')),
  source            text not null default 'manual' check (source in ('manual','ai_extracted')),
  notes             text,
  created_by        uuid references auth.users on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index buyers_company_idx on public.buyers (company_id, created_at desc);
create trigger buyers_updated_at before update on public.buyers
  for each row execute function public.set_updated_at();

-- ── RFQs ────────────────────────────────────────────────────────────
create table public.rfqs (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies on delete cascade,
  buyer_id     uuid references public.buyers on delete set null,
  title        text not null,
  product_type text,
  description  text,
  quantity     integer,
  unit         text not null default 'pcs',
  target_price numeric(12,2),
  currency     text not null default 'USD',
  deadline     date,
  status       text not null default 'open'
    check (status in ('open','quoted','won','lost','cancelled')),
  source       text not null default 'manual' check (source in ('manual','ai_extracted')),
  notes        text,
  created_by   uuid references auth.users on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index rfqs_company_idx on public.rfqs (company_id, created_at desc);
create index rfqs_buyer_idx on public.rfqs (buyer_id);
create trigger rfqs_updated_at before update on public.rfqs
  for each row execute function public.set_updated_at();

-- ── Quotes (a priced response to an RFQ) ────────────────────────────
create table public.quotes (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies on delete cascade,
  rfq_id        uuid not null references public.rfqs on delete cascade,
  version       integer not null default 1,
  currency      text not null default 'USD',
  material_cost numeric(12,2) not null default 0,
  labor_cost    numeric(12,2) not null default 0,
  overhead_cost numeric(12,2) not null default 0,
  freight_cost  numeric(12,2) not null default 0,
  margin_pct    numeric(5,2)  not null default 0,
  fob_price     numeric(12,2) not null default 0,   -- computed by the engine, stored for history
  lead_time_days integer,
  moq           integer,
  status        text not null default 'draft' check (status in ('draft','sent','accepted','rejected')),
  source        text not null default 'manual' check (source in ('manual','marbim')),
  created_by    uuid references auth.users on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index quotes_rfq_idx on public.quotes (rfq_id, version desc);
create trigger quotes_updated_at before update on public.quotes
  for each row execute function public.set_updated_at();

-- ── Quote line items (BOM / labor detail) ───────────────────────────
create table public.quote_lines (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quotes on delete cascade,
  kind        text not null check (kind in ('material','labor','overhead','freight')),
  description text,
  quantity    numeric(12,4) not null default 1,
  unit        text,
  unit_cost   numeric(12,4) not null default 0,
  line_total  numeric(12,2) not null default 0
);
create index quote_lines_quote_idx on public.quote_lines (quote_id);

-- ── RFQ clarifications ──────────────────────────────────────────────
create table public.rfq_clarifications (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies on delete cascade,
  rfq_id     uuid not null references public.rfqs on delete cascade,
  question   text not null,
  answer     text,
  status     text not null default 'open' check (status in ('open','answered')),
  raised_by  uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);
create index rfq_clar_rfq_idx on public.rfq_clarifications (rfq_id);

-- ── RLS ─────────────────────────────────────────────────────────────
alter table public.buyers             enable row level security;
alter table public.rfqs               enable row level security;
alter table public.quotes             enable row level security;
alter table public.quote_lines        enable row level security;
alter table public.rfq_clarifications enable row level security;

create policy "members manage buyers" on public.buyers for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "members manage rfqs" on public.rfqs for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "members manage quotes" on public.quotes for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- quote_lines inherit tenancy through their parent quote.
create policy "members manage quote_lines" on public.quote_lines for all
  using (exists (select 1 from public.quotes q
                 where q.id = quote_lines.quote_id
                   and q.company_id = public.current_company_id()))
  with check (exists (select 1 from public.quotes q
                 where q.id = quote_lines.quote_id
                   and q.company_id = public.current_company_id()));

create policy "members manage clarifications" on public.rfq_clarifications for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());
