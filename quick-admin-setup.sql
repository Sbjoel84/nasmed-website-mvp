-- Quick Admin Setup Script
-- Run this in Supabase SQL Editor to set up admin access

-- Step 1: Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  membership_type TEXT DEFAULT 'Professional Member',
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies
DROP POLICY IF EXISTS "allow_read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;

CREATE POLICY "allow_read_profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "allow_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Step 5: Find existing users and promote one to admin
-- Replace 'your-email@example.com' with the email of the user you want to make admin
-- You can find user emails in Authentication > Users in Supabase dashboard

-- Option A: Promote existing user to admin
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your-existing-user-email@example.com';

-- Option B: Create a new admin user (run this, then create user in Auth dashboard)
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES ('user-uuid-here', 'admin@nasmed.org', 'NASMED Admin', 'admin');

-- Step 6: Check current profiles
SELECT id, email, full_name, role FROM public.profiles;