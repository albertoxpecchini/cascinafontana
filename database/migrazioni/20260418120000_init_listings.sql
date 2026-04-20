-- Cascina Fontana — Supabase schema
-- Run in: Supabase Dashboard > SQL Editor

-- =====================================================
-- 1. LISTINGS TABLE
-- =====================================================
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  title       text not null,
  price       text,
  description text,
  category    text check (category in ('macchine','prodotti','materiali')),
  image_url   text,
  status      text not null default 'available' check (status in ('available','sold'))
);

create index if not exists listings_created_idx on public.listings (created_at desc);
create index if not exists listings_category_idx on public.listings (category);

-- Auto updated_at
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists listings_touch on public.listings;
create trigger listings_touch
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- =====================================================
-- 2. ROW LEVEL SECURITY
-- =====================================================
alter table public.listings enable row level security;

drop policy if exists "listings_read_public" on public.listings;
create policy "listings_read_public"
  on public.listings for select
  using (true);

drop policy if exists "listings_write_auth" on public.listings;
create policy "listings_write_auth"
  on public.listings for all
  to authenticated
  using (true) with check (true);

-- =====================================================
-- 3. STORAGE BUCKET for images
-- =====================================================
insert into storage.buckets (id, name, public)
  values ('listings','listings',true)
  on conflict (id) do nothing;

drop policy if exists "storage_listings_read" on storage.objects;
create policy "storage_listings_read"
  on storage.objects for select
  using (bucket_id = 'listings');

drop policy if exists "storage_listings_write" on storage.objects;
create policy "storage_listings_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listings');

drop policy if exists "storage_listings_delete" on storage.objects;
create policy "storage_listings_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listings');

-- =====================================================
-- 4. REALTIME
-- =====================================================
alter publication supabase_realtime add table public.listings;
