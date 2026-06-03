-- Revoke all privileges on public.spatial_ref_sys from anon and authenticated roles.
-- Since this table is owned by supabase_admin, RLS cannot be altered directly by the postgres role.
-- Revoking all privileges removes it from PostgREST API access and resolves the critical security warning.
REVOKE ALL ON TABLE public.spatial_ref_sys FROM anon, authenticated;
