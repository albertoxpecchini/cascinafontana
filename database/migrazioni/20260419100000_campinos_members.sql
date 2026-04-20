-- Cascina Fontana — Campino's Members table + RLS
-- Prerequisite: table + trigger already created in Supabase Dashboard.
-- This migration documents the expected schema and ensures correct RLS policies.

-- =====================================================
-- 1. TABLE  (idempotent — skip if already exists)
-- =====================================================
create table if not exists public.campinos_members (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists campinos_members_user_idx on public.campinos_members (user_id);

-- Auto updated_at (reuses existing touch_updated_at function)
drop trigger if exists campinos_members_touch on public.campinos_members;
create trigger campinos_members_touch
  before update on public.campinos_members
  for each row execute function public.touch_updated_at();

-- =====================================================
-- 2. ROW LEVEL SECURITY
-- =====================================================
alter table public.campinos_members enable row level security;

-- Users can only read their own membership row
drop policy if exists "campinos_members_select_own" on public.campinos_members;
create policy "campinos_members_select_own"
  on public.campinos_members for select
  to authenticated
  using ( user_id = auth.uid() );

-- No insert/update/delete for regular users.
-- Rows are created by the on-signup trigger (SECURITY DEFINER function).
-- Admin changes are made via Supabase Dashboard or service_role.

-- =====================================================
-- 3. TRIGGER: auto-create membership on signup
--    (idempotent — recreates function + trigger)
-- =====================================================
create or replace function public.handle_new_user_campinos()
returns trigger
security definer
set search_path = ''
as $$
begin
  insert into public.campinos_members (user_id, is_active)
  values (new.id, true)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_auth_user_created_campinos on auth.users;
create trigger on_auth_user_created_campinos
  after insert on auth.users
  for each row execute function public.handle_new_user_campinos();
