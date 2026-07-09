-- fabricXai foundation: multi-tenant tenancy + the pending_changes spine.
-- Every module table hangs off companies via company_id and is guarded by RLS.

-- ── Tenancy ─────────────────────────────────────────────────────────

create table public.companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  company_id uuid not null references public.companies on delete cascade,
  full_name  text,
  email      text,
  role       text not null default 'owner'
    check (role in ('owner','admin','manager','member','viewer')),
  created_at timestamptz not null default now()
);

-- Company of the currently authenticated user — used by every RLS policy.
create or replace function public.current_company_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid()
$$;

-- Shared updated_at trigger fn (module tables reuse this).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- On signup: create the user's company + profile from auth metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  new_company_id uuid;
begin
  insert into public.companies (name)
  values (coalesce(new.raw_user_meta_data ->> 'company_name', 'My Company'))
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, email, role)
  values (
    new.id,
    new_company_id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    'owner'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── pending_changes: the propose → approve → commit spine ───────────
-- MARBIM / extraction never writes a module table directly. It writes a
-- pending_changes row; the Approve inbox commits it to target_table.

create table public.pending_changes (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies on delete cascade,
  module        text not null,                       -- 'rfq', 'buyer', ...
  action        text not null default 'create'
    check (action in ('create','update','delete')),
  target_table  text not null,                       -- e.g. 'rfqs'
  target_id     uuid,                                -- set for update/delete
  payload       jsonb not null default '{}',         -- the drafted row
  summary       text,                                -- human-readable one-liner
  ai_confidence numeric(4,3),                         -- 0..1 if AI-sourced
  source        text not null default 'manual'
    check (source in ('marbim','extract','manual')),
  status        text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  reject_reason text,
  created_by    uuid references auth.users on delete set null,
  reviewed_by   uuid references auth.users on delete set null,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index pending_changes_company_status_idx
  on public.pending_changes (company_id, status, created_at desc);

create trigger pending_changes_updated_at
  before update on public.pending_changes
  for each row execute function public.set_updated_at();

-- ── Row-level security ──────────────────────────────────────────────

alter table public.companies       enable row level security;
alter table public.profiles        enable row level security;
alter table public.pending_changes enable row level security;

create policy "members read own company"
  on public.companies for select
  using (id = public.current_company_id());

create policy "members read company profiles"
  on public.profiles for select
  using (company_id = public.current_company_id());

create policy "users update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "company members manage pending changes"
  on public.pending_changes for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());
