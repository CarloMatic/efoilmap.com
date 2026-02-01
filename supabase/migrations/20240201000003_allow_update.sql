-- Allow public updates to spots (for "Suggest Edit")
create policy "Everyone can update spots"
  on public.spots for update
  using ( true )
  with check ( true );
