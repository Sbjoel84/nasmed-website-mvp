-- =============================================================================
-- NASMED Member Profiles Schema Migration
-- Run this in the Supabase SQL Editor BEFORE using "Initialize All Accounts"
-- =============================================================================

-- Step 1: Add new columns to the profiles table (safe - skips if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='must_change_password') THEN
    ALTER TABLE public.profiles ADD COLUMN must_change_password BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='position') THEN
    ALTER TABLE public.profiles ADD COLUMN position TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='member_number') THEN
    ALTER TABLE public.profiles ADD COLUMN member_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='status') THEN
    ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
END $$;

-- Step 2: Create index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- =============================================================================
-- After running the SQL above, go to Admin → Credentials and click
-- "Initialize All Accounts" to create Supabase auth accounts for all members.
-- =============================================================================

-- Step 3 (Optional): After accounts are created via the admin panel,
-- you can manually update profile metadata for any specific member:
-- Example — update Prof. Olatunde Makanju's profile after account creation:
--
-- UPDATE public.profiles
-- SET
--   username        = 'olatunde.makanju',
--   member_number   = 'NASMED/24/0001',
--   position        = 'Immediate Past President',
--   must_change_password = true,
--   status          = 'active'
-- WHERE email = 'olatunde.makanju@yahoo.com';
