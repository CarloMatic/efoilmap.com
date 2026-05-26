-- 1. Spot Question Likes Table
CREATE TABLE IF NOT EXISTS public.spot_question_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.spot_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(question_id, user_id)
);

-- Enable RLS on spot_question_likes
ALTER TABLE public.spot_question_likes ENABLE ROW LEVEL SECURITY;

-- Select policy: Viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_question_likes' AND policyname = 'Question likes viewable by everyone.'
  ) THEN
    CREATE POLICY "Question likes viewable by everyone."
      ON public.spot_question_likes FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Users can like questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_question_likes' AND policyname = 'Users can like questions.'
  ) THEN
    CREATE POLICY "Users can like questions."
      ON public.spot_question_likes FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy: Users can unlike questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_question_likes' AND policyname = 'Users can unlike questions.'
  ) THEN
    CREATE POLICY "Users can unlike questions."
      ON public.spot_question_likes FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;


-- 2. Spot Answer Likes Table
CREATE TABLE IF NOT EXISTS public.spot_answer_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID REFERENCES public.spot_answers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(answer_id, user_id)
);

-- Enable RLS on spot_answer_likes
ALTER TABLE public.spot_answer_likes ENABLE ROW LEVEL SECURITY;

-- Select policy: Viewable by everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_answer_likes' AND policyname = 'Answer likes viewable by everyone.'
  ) THEN
    CREATE POLICY "Answer likes viewable by everyone."
      ON public.spot_answer_likes FOR SELECT
      USING ( true );
  END IF;
END $$;

-- Insert policy: Users can like answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_answer_likes' AND policyname = 'Users can like answers.'
  ) THEN
    CREATE POLICY "Users can like answers."
      ON public.spot_answer_likes FOR INSERT
      WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
  END IF;
END $$;

-- Delete policy: Users can unlike answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_answer_likes' AND policyname = 'Users can unlike answers.'
  ) THEN
    CREATE POLICY "Users can unlike answers."
      ON public.spot_answer_likes FOR DELETE
      USING ( auth.uid() = user_id );
  END IF;
END $$;
