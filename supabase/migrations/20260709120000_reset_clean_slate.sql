-- fabricXai clean slate: remove the sibling (fabricxai-platform) schema.
-- Drops all 7 sibling tables + functions in one shot; restores Supabase's
-- standard grants so PostgREST exposes future tables. Authorized 2026-07-09.

drop schema public cascade;
create schema public;

grant usage on schema public to anon, authenticated, service_role;
grant all   on schema public to postgres, service_role;
alter default privileges in schema public grant all on tables    to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- Sibling's auth trigger (its function lived in public and is now gone).
drop trigger if exists on_auth_user_created on auth.users;
