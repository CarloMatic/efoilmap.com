-- Add notification preference columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS locale VARCHAR(10) DEFAULT 'de',
ADD COLUMN IF NOT EXISTS email_pref_visits BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_pref_questions BOOLEAN DEFAULT true;
