-- Extend listings with machinery-specific fields + add updates table

-- =====================================================
-- 1. EXTEND LISTINGS
-- =====================================================
alter table public.listings
  add column if not exists brand         text,
  add column if not exists model         text,
  add column if not exists displacement  text,
  add column if not exists hp            text,
  add column if not exists fuel          text,
  add column if not exists usage_hours   text,
  add column if not exists condition     text,
  add column if not exists color         text,
  add column if not exists registered    boolean not null default false,
  add column if not exists documents     boolean not null default false,
  add column if not exists insured       boolean not null default false,
  add column if not exists image_urls    text[] not null default '{}';

-- =====================================================
-- 2. UPDATES TABLE
-- =====================================================
create table if not exists public.updates (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  title       text not null,
  description text,
  city        text,
  country     text,
  image_urls  text[] not null default '{}'
);

create index if not exists updates_created_idx on public.updates (created_at desc);

drop trigger if exists updates_touch on public.updates;
create trigger updates_touch
  before update on public.updates
  for each row execute function public.touch_updated_at();

alter table public.updates enable row level security;

drop policy if exists "updates_read_public" on public.updates;
create policy "updates_read_public"
  on public.updates for select
  using (true);

drop policy if exists "updates_write_auth" on public.updates;
create policy "updates_write_auth"
  on public.updates for all
  to authenticated
  using (true) with check (true);

-- =====================================================
-- 3. UPDATES STORAGE BUCKET
-- =====================================================
insert into storage.buckets (id, name, public)
  values ('updates','updates',true)
  on conflict (id) do nothing;

drop policy if exists "storage_updates_read" on storage.objects;
create policy "storage_updates_read"
  on storage.objects for select
  using (bucket_id = 'updates');

drop policy if exists "storage_updates_write" on storage.objects;
create policy "storage_updates_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'updates');

drop policy if exists "storage_updates_delete" on storage.objects;
create policy "storage_updates_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'updates');

-- =====================================================
-- 4. REALTIME
-- =====================================================
alter publication supabase_realtime add table public.updates;
