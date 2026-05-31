-- Create Spot Deletions table
CREATE TABLE IF NOT EXISTS public.spot_deletions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.spot_deletions ENABLE ROW LEVEL SECURITY;

-- Select policy: A user can see their own spot deletions
CREATE POLICY "Users can view their own spot deletions."
  ON public.spot_deletions FOR SELECT
  USING ( auth.uid() = user_id );

-- Insert policy: Service role / Admin can insert
CREATE POLICY "Anyone can insert spot deletions"
  ON public.spot_deletions FOR INSERT
  WITH CHECK ( true );
