-- Migration: Add last_read_notifications_at to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_read_notifications_at timestamptz;
