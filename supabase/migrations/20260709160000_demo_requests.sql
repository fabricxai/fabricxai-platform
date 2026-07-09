-- Public "Request demo access" submissions from the login page (unauthenticated).
-- Only the service role (via /api/demo-request) may write; RLS blocks anon/auth
-- reads and writes, so submissions are never exposed to the client.

create table public.demo_requests (
  id           uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email        text not null,
  phone        text,
  country      text,
  company_size text,
  message      text,
  status       text not null default 'new' check (status in ('new','contacted','converted','declined')),
  created_at   timestamptz not null default now()
);

create index demo_requests_created_idx on public.demo_requests (created_at desc);

alter table public.demo_requests enable row level security;
-- No policies on purpose: only the service_role key (server-side API route) can access.
