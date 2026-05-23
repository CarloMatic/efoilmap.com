-- 1. Harden Spots Table Policies (Option A: Authenticated Crowdsourcing)
-- Drop permissive public update and insert policies
drop policy if exists "Everyone can update spots" on public.spots;
drop policy if exists "Everyone can create spots." on public.spots;
drop policy if exists "Users can update their own spots." on public.spots;
drop policy if exists "Authenticated users can create spots." on public.spots;

-- Require authentication to create spots
create policy "Authenticated users can create spots"
  on public.spots for insert
  with check ( auth.role() = 'authenticated' );

-- Option A: Require authentication to update spots (any logged-in user can suggest edits)
create policy "Authenticated users can update spots"
  on public.spots for update
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );


-- 2. Harden Spot Verifications (Reviews)
-- Drop permissive public insert policies
drop policy if exists "Everyone can verify spots." on public.spot_verifications;
drop policy if exists "Everyone can verify" on public.spot_verifications;
drop policy if exists "Auth users can verify" on public.spot_verifications;

-- Require authentication to submit a verification
create policy "Authenticated users can verify spots"
  on public.spot_verifications for insert
  with check ( auth.role() = 'authenticated' );

-- Allow users to update their own verifications
create policy "Authenticated users can update own verifications"
  on public.spot_verifications for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );


-- 3. Harden Spot Photos Table
-- Drop permissive public insert policies
drop policy if exists "Everyone can upload photos" on public.spot_photos;

-- Require authentication to add photo references
create policy "Authenticated users can insert photos"
  on public.spot_photos for insert
  with check ( auth.role() = 'authenticated' );

-- Allow authenticated users to delete photo references
create policy "Authenticated users can delete photos"
  on public.spot_photos for delete
  using ( auth.role() = 'authenticated' );


-- 4. Harden Storage Objects Policies (Spots Bucket)
-- Drop permissive anonymous insert policy
drop policy if exists "Public Upload to Spots Bucket" on storage.objects;

-- Require authentication to upload photos to 'spots' bucket
create policy "Authenticated users can upload to spots bucket"
  on storage.objects for insert
  with check ( bucket_id = 'spots' and auth.role() = 'authenticated' );

-- Require authentication to delete photos from 'spots' bucket
create policy "Authenticated users can delete from spots bucket"
  on storage.objects for delete
  using ( bucket_id = 'spots' and auth.role() = 'authenticated' );
