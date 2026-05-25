-- 1. Create Profile Likes Table
CREATE TABLE IF NOT EXISTS public.profile_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  liker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(target_profile_id, liker_id)
);

-- Enable RLS on profile_likes
ALTER TABLE public.profile_likes ENABLE ROW LEVEL SECURITY;

-- Select policy: Likes viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_likes' AND policyname = 'Profile likes viewable by everyone.'
  ) THEN
    CREATE POLICY "Profile likes viewable by everyone."
      ON public.profile_likes FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can like profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_likes' AND policyname = 'Users can like profiles.'
  ) THEN
    CREATE POLICY "Users can like profiles."
      ON public.profile_likes FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = liker_id );
  END IF;
END $$;

-- Delete policy: Users can unlike profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_likes' AND policyname = 'Users can unlike profiles.'
  ) THEN
    CREATE POLICY "Users can unlike profiles."
      ON public.profile_likes FOR DELETE
      USING ( auth.uid() = liker_id );
  END IF;
END $$;


-- 2. Create Profile Reviews Table
CREATE TABLE IF NOT EXISTS public.profile_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(target_profile_id, author_id)
);

-- Enable RLS on profile_reviews
ALTER TABLE public.profile_reviews ENABLE ROW LEVEL SECURITY;

-- Select policy: Reviews viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_reviews' AND policyname = 'Profile reviews viewable by everyone.'
  ) THEN
    CREATE POLICY "Profile reviews viewable by everyone."
      ON public.profile_reviews FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can review profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_reviews' AND policyname = 'Users can review profiles.'
  ) THEN
    CREATE POLICY "Users can review profiles."
      ON public.profile_reviews FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = author_id );
  END IF;
END $$;

-- Update policy: Users can edit their own reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_reviews' AND policyname = 'Users can edit own profile reviews.'
  ) THEN
    CREATE POLICY "Users can edit own profile reviews."
      ON public.profile_reviews FOR UPDATE
      USING ( auth.uid() = author_id );
  END IF;
END $$;

-- Delete policy: Author or profile owner can delete reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_reviews' AND policyname = 'Author or profile owner can delete reviews.'
  ) THEN
    CREATE POLICY "Author or profile owner can delete reviews."
      ON public.profile_reviews FOR DELETE
      USING ( auth.uid() = author_id OR auth.uid() = target_profile_id );
  END IF;
END $$;


-- 3. Create Profile Review Replies Table
CREATE TABLE IF NOT EXISTS public.profile_review_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.profile_reviews(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reply TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(review_id)
);

-- Enable RLS on profile_review_replies
ALTER TABLE public.profile_review_replies ENABLE ROW LEVEL SECURITY;

-- Select policy: Replies viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_review_replies' AND policyname = 'Replies viewable by everyone.'
  ) THEN
    CREATE POLICY "Replies viewable by everyone."
      ON public.profile_review_replies FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can reply
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_review_replies' AND policyname = 'Users can reply to reviews.'
  ) THEN
    CREATE POLICY "Users can reply to reviews."
      ON public.profile_review_replies FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = author_id );
  END IF;
END $$;

-- Update policy: Users can edit their own replies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_review_replies' AND policyname = 'Users can edit own replies.'
  ) THEN
    CREATE POLICY "Users can edit own replies."
      ON public.profile_review_replies FOR UPDATE
      USING ( auth.uid() = author_id );
  END IF;
END $$;

-- Delete policy: Author or profile owner can delete replies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_review_replies' AND policyname = 'Author or profile owner can delete replies.'
  ) THEN
    CREATE POLICY "Author or profile owner can delete replies."
      ON public.profile_review_replies FOR DELETE
      USING ( auth.uid() = author_id );
  END IF;
END $$;
