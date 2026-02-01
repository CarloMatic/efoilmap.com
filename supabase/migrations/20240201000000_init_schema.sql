-- Enable PostGIS for geospatial queries
create extension if not exists postgis;

-- 1. Profiles Table (Public User Info)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. Spots Table
create type spot_status as enum ('ALLOWED', 'TOLERATED', 'FORBIDDEN', 'UNCLEAR');

create table public.spots (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  created_by uuid references public.profiles(id),
  
  name text not null,
  description text,
  status spot_status default 'UNCLEAR',
  
  -- Geospatial Point (Longitude, Latitude)
  location geography(POINT) generated always as (st_setsrid(st_point(lng, lat), 4326)::geography) stored,
  lat double precision not null,
  lng double precision not null,
  
  -- Flexible JSONB for detailed attributes
  -- Structure: { 
  --   entry: { difficulty: 'easy', surface: 'sand' },
  --   infra: { charging: true, parking: true },
  --   meta: { crowd_level: 'medium' } 
  -- }
  attributes jsonb default '{}'::jsonb,
  
  -- Optimized search columns can be added later if JSONB is too slow
  last_verified_at timestamptz default now(),
  
  -- Search vector for text search (optional for v1)
  fts tsvector generated always as (to_tsvector('english', name || ' ' || coalesce(description, ''))) stored
);

-- Index for fast geospatial queries
create index spots_geo_index on public.spots using GIST (location);

alter table public.spots enable row level security;

-- Policies
create policy "Spots are viewable by everyone."
  on public.spots for select
  using ( true );

create policy "Authenticated users can create spots."
  on public.spots for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own spots."
  on public.spots for update
  using ( auth.uid() = created_by );

-- 3. Spot Verifications (Community Confirmation)
create table public.spot_verifications (
  id uuid default gen_random_uuid() primary key,
  spot_id uuid references public.spots(id) on delete cascade,
  user_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  unique(spot_id, user_id) -- Prevent spamming verify
);

alter table public.spot_verifications enable row level security;

create policy "Verifications viewable by everyone" 
  on public.spot_verifications for select using (true);

create policy "Auth users can verify" 
  on public.spot_verifications for insert with check (auth.role() = 'authenticated');

-- Function to update spot's last_verified_at on new verification
create or replace function update_spot_verified_timestamp()
returns trigger as $$
begin
  update public.spots
  set last_verified_at = now()
  where id = new.spot_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_verification_created
  after insert on public.spot_verifications
  for each row execute procedure update_spot_verified_timestamp();

-- SEED DATA
INSERT INTO public.spots (name, status, lat, lng, description, attributes)
VALUES
    ('Rursee (Schwammenauel)', 'ALLOWED', 50.638, 6.385, 'Official e-foil zone. Ticket required.', '{"parking": true, "charging": true, "food": true}'),
    ('Fühlinger See', 'FORBIDDEN', 51.023, 6.920, 'Strictly forbidden. Police patrols.', '{"parking": true}'),
    ('Zürichsee (Kibag)', 'TOLERATED', 47.330, 8.560, 'Tolerated in early mornings.', '{"food": true}'),
    ('Lago di Garda (Malcesine)', 'ALLOWED', 45.760, 10.800, 'Perfect wind conditions.', '{"parking": true, "charging": true, "food": true}');
