-- Add ai_translation_enabled column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ai_translation_enabled BOOLEAN DEFAULT true NOT NULL;
