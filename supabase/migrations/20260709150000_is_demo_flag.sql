-- Mark seeded demo data so it's clearly identifiable in the UI and can be
-- deleted in one shot ("Clear demo data") without touching real records.

alter table public.buyers add column if not exists is_demo boolean not null default false;
alter table public.rfqs   add column if not exists is_demo boolean not null default false;
alter table public.quotes add column if not exists is_demo boolean not null default false;

-- Flag everything seeded so far (created 2026-07-09) as demo.
update public.buyers set is_demo = true where created_at::date = '2026-07-09';
update public.rfqs   set is_demo = true where created_at::date = '2026-07-09';
update public.quotes set is_demo = true where created_at::date = '2026-07-09';
