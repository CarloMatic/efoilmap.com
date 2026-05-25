-- 1. Create Spot Questions Table
CREATE TABLE IF NOT EXISTS public.spot_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on spot_questions
ALTER TABLE public.spot_questions ENABLE ROW LEVEL SECURITY;

-- Select policy: Questions viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_questions' AND policyname = 'Questions viewable by everyone.'
  ) THEN
    CREATE POLICY "Questions viewable by everyone."
      ON public.spot_questions FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can ask questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_questions' AND policyname = 'Users can ask questions.'
  ) THEN
    CREATE POLICY "Users can ask questions."
      ON public.spot_questions FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy: Users can delete their own questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_questions' AND policyname = 'Users can delete own questions.'
  ) THEN
    CREATE POLICY "Users can delete own questions."
      ON public.spot_questions FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;


-- 2. Create Spot Answers Table
CREATE TABLE IF NOT EXISTS public.spot_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.spot_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on spot_answers
ALTER TABLE public.spot_answers ENABLE ROW LEVEL SECURITY;

-- Select policy: Answers viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_answers' AND policyname = 'Answers viewable by everyone.'
  ) THEN
    CREATE POLICY "Answers viewable by everyone."
      ON public.spot_answers FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Authenticated users can answer questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_answers' AND policyname = 'Users can answer questions.'
  ) THEN
    CREATE POLICY "Users can answer questions."
      ON public.spot_answers FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy: Users can delete their own answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_answers' AND policyname = 'Users can delete own answers.'
  ) THEN
    CREATE POLICY "Users can delete own answers."
      ON public.spot_answers FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;
