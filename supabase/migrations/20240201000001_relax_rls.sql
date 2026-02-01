-- Relax RLS for public spot creation
-- Drop existing insert policy
drop policy "Authenticated users can create spots." on public.spots;

-- Create new policy for public (anon) creation
create policy "Everyone can create spots."
  on public.spots for insert
  with check ( true );

-- ALSO RELAX VERIFICATIONS
drop policy "Auth users can verify" on public.spot_verifications;

create policy "Everyone can verify spots."
  on public.spot_verifications for insert
  with check ( true );
