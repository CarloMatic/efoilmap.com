-- 1. Update spot_verifications for Rating & Comments
alter table public.spot_verifications 
add column if not exists rating integer check (rating >= 1 and rating <= 5),
add column if not exists comment text;

-- 2. Create Photos Table
create table if not exists public.spot_photos (
  id uuid default gen_random_uuid() primary key,
  spot_id uuid references public.spots(id) on delete cascade,
  url text not null,
  created_at timestamptz default now(),
  created_by uuid references public.profiles(id)
);

-- 3. RLS for Photos
alter table public.spot_photos enable row level security;

create policy "Photos viewable by everyone" 
  on public.spot_photos for select using (true);

create policy "Everyone can upload photos" 
  on public.spot_photos for insert with check (true);

-- 4. Storage Bucket (SQL to create bucket is not standard in generic postgres, 
-- usually done via API/Dashboard. But we can ensure policy exists if bucket exists)
-- We will instruct user to create 'spots' bucket public.

-- 5. STORAGE POLICIES (for tables in storage schema)
-- We need to enable public access to storage.objects for the 'spots' bucket
-- NOTE: This often requires manual dashboard setup, but we can try via SQL if permissions allow.
