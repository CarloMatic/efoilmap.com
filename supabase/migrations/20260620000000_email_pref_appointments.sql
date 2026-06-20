-- Migration: Add email_pref_appointments column to profiles
-- This column controls whether users receive email notifications
-- when new appointments are created at spots they bookmarked or rated.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_pref_appointments boolean DEFAULT true;
