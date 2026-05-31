-- Enable RLS on spatial_ref_sys to silence Supabase security warning
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Allow all users to read from it so PostGIS functions still work for everyone
CREATE POLICY "Allow read access to all" ON public.spatial_ref_sys FOR SELECT USING (true);
