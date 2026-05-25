-- 1. Spot Visits Table
CREATE TABLE IF NOT EXISTS public.spot_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on Spot Visits
ALTER TABLE public.spot_visits ENABLE ROW LEVEL SECURITY;

-- Select policy: Spot visits are viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_visits' AND policyname = 'Spot visits are viewable by everyone.'
  ) THEN
    CREATE POLICY "Spot visits are viewable by everyone."
      ON public.spot_visits FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can create spot visits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_visits' AND policyname = 'Authenticated users can create spot visits.'
  ) THEN
    CREATE POLICY "Authenticated users can create spot visits."
      ON public.spot_visits FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy: Users can delete their own spot visits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_visits' AND policyname = 'Users can delete their own spot visits.'
  ) THEN
    CREATE POLICY "Users can delete their own spot visits."
      ON public.spot_visits FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;


-- 2. Visit Comments Table (Replies)
CREATE TABLE IF NOT EXISTS public.visit_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID REFERENCES public.spot_visits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on Visit Comments
ALTER TABLE public.visit_comments ENABLE ROW LEVEL SECURITY;

-- Select policy: Visit comments are viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_comments' AND policyname = 'Visit comments are viewable by everyone.'
  ) THEN
    CREATE POLICY "Visit comments are viewable by everyone."
      ON public.visit_comments FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can post comments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_comments' AND policyname = 'Authenticated users can post comments.'
  ) THEN
    CREATE POLICY "Authenticated users can post comments."
      ON public.visit_comments FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy: Users can delete their own comments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_comments' AND policyname = 'Users can delete their own comments.'
  ) THEN
    CREATE POLICY "Users can delete their own comments."
      ON public.visit_comments FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;


-- 3. Security Definer function to retrieve the creator's email for notification
CREATE OR REPLACE FUNCTION public.get_profile_email(profile_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = profile_id;
  RETURN user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Visit Participants Table (Join/Cancel)
CREATE TABLE IF NOT EXISTS public.visit_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID REFERENCES public.spot_visits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'JOINED' CHECK (status IN ('JOINED', 'CANCELLED')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(visit_id, user_id)
);

-- Enable RLS
ALTER TABLE public.visit_participants ENABLE ROW LEVEL SECURITY;

-- Select policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_participants' AND policyname = 'Visit participants are viewable by everyone.'
  ) THEN
    CREATE POLICY "Visit participants are viewable by everyone."
      ON public.visit_participants FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_participants' AND policyname = 'Authenticated users can join visits.'
  ) THEN
    CREATE POLICY "Authenticated users can join visits."
      ON public.visit_participants FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Update policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_participants' AND policyname = 'Users can update their own participant status.'
  ) THEN
    CREATE POLICY "Users can update their own participant status."
      ON public.visit_participants FOR UPDATE
      USING ( auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visit_participants' AND policyname = 'Users can leave visits.'
  ) THEN
    CREATE POLICY "Users can leave visits."
      ON public.visit_participants FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;
