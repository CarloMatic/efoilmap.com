-- 1. Fix Spot Verifications (Allow Anon Reviews)
drop policy if exists "Auth users can verify" on public.spot_verifications;
create policy "Everyone can verify" 
on public.spot_verifications 
for insert 
with check (true);

-- 2. Fix Spot Photos (Allow Anon DB Insert - Ensure policy exists)
drop policy if exists "Everyone can upload photos" on public.spot_photos;
create policy "Everyone can upload photos" 
on public.spot_photos 
for insert 
with check (true);

-- 3. STORAGE POLICIES (Allow Anon Uploads to 'spots' bucket)
-- Note: You must ensure the 'spots' bucket exists.
-- This part attempts to create the bucket and policies.

-- Create bucket if not exists
insert into storage.buckets (id, name, public)
values ('spots', 'spots', true)
on conflict (id) do nothing;

-- Public Select
drop policy if exists "Public Access to Spots Bucket" on storage.objects;
create policy "Public Access to Spots Bucket"
on storage.objects for select
using ( bucket_id = 'spots' );

-- Public Insert
drop policy if exists "Public Upload to Spots Bucket" on storage.objects;
create policy "Public Upload to Spots Bucket"
on storage.objects for insert
with check ( bucket_id = 'spots' );
