-- 1. Ensure last_read_notifications_at is added to profiles if missing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_read_notifications_at timestamptz;

-- 2. Spot Likes Table
CREATE TABLE IF NOT EXISTS public.spot_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(spot_id, user_id)
);

-- Enable RLS on Likes
ALTER TABLE public.spot_likes ENABLE ROW LEVEL SECURITY;

-- Select policy: Spot likes viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_likes' AND policyname = 'Likes viewable by everyone.'
  ) THEN
    CREATE POLICY "Likes viewable by everyone."
      ON public.spot_likes FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert/Delete policy: Users can like/unlike spots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_likes' AND policyname = 'Users can like spots.'
  ) THEN
    CREATE POLICY "Users can like spots."
      ON public.spot_likes FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_likes' AND policyname = 'Users can unlike spots.'
  ) THEN
    CREATE POLICY "Users can unlike spots."
      ON public.spot_likes FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;


-- 3. Spot Bookmarks Table
CREATE TABLE IF NOT EXISTS public.spot_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(spot_id, user_id)
);

-- Enable RLS on Bookmarks
ALTER TABLE public.spot_bookmarks ENABLE ROW LEVEL SECURITY;

-- Select policy: Users can view their own bookmarks (bookmarks are private/personal)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_bookmarks' AND policyname = 'Users can view own bookmarks.'
  ) THEN
    CREATE POLICY "Users can view own bookmarks."
      ON public.spot_bookmarks FOR SELECT
      USING ( auth.uid() = user_id );
  END IF;
END $$;

-- Insert/Delete policy: Users can bookmark/unbookmark spots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_bookmarks' AND policyname = 'Users can bookmark spots.'
  ) THEN
    CREATE POLICY "Users can bookmark spots."
      ON public.spot_bookmarks FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_bookmarks' AND policyname = 'Users can unbookmark spots.'
  ) THEN
    CREATE POLICY "Users can unbookmark spots."
      ON public.spot_bookmarks FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;


-- 4. Fix existing spots where created_by is NULL by copying user_id
UPDATE public.spots
SET created_by = user_id
WHERE created_by IS NULL AND user_id IS NOT NULL;
