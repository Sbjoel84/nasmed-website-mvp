-- Run this in the Supabase SQL editor to enable the Posters feature.
-- NOTE: The admin uses the anon key (local password auth), so policies must allow anon writes.

-- 1. Create the posters table
create table if not exists public.posters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text,
  description text,
  image_url text not null,
  published boolean not null default true
);

-- 2. Enable Row Level Security
alter table public.posters enable row level security;

-- 3. Drop existing table policies (safe to re-run)
drop policy if exists "Anyone can view posters" on public.posters;
drop policy if exists "Anyone can insert posters" on public.posters;
drop policy if exists "Anyone can update posters" on public.posters;
drop policy if exists "Anyone can delete posters" on public.posters;

-- 4. Create table policies — allow anon key (admin via local auth) full access
create policy "Anyone can view posters"   on public.posters for select using (true);
create policy "Anyone can insert posters" on public.posters for insert with check (true);
create policy "Anyone can update posters" on public.posters for update using (true);
create policy "Anyone can delete posters" on public.posters for delete using (true);

-- 5. Create the storage bucket (safe to re-run)
insert into storage.buckets (id, name, public)
values ('posters', 'posters', true)
on conflict (id) do nothing;

-- 6. Drop existing storage policies (safe to re-run)
drop policy if exists "Public can view poster images"  on storage.objects;
drop policy if exists "Anyone can upload poster images" on storage.objects;
drop policy if exists "Anyone can delete poster images" on storage.objects;

-- 7. Create storage policies
create policy "Public can view poster images"   on storage.objects for select using (bucket_id = 'posters');
create policy "Anyone can upload poster images" on storage.objects for insert with check (bucket_id = 'posters');
create policy "Anyone can delete poster images" on storage.objects for delete using (bucket_id = 'posters');
