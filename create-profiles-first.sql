-- STEP 1: CREATE THE PROFILES TABLE FIRST
-- Copy and paste this entire block into Supabase SQL Editor and run it

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  membership_type TEXT DEFAULT 'Professional Member',
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;

CREATE POLICY "allow_read_profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "allow_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- STEP 2: VERIFY TABLE EXISTS
-- After running above, run this to confirm:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles';

-- STEP 3: PROMOTE YOUR USER TO ADMIN
-- Only run this AFTER the table is created:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'joelyahaya7@gmail.com';

-- STEP 4: VERIFY ADMIN ROLE
-- Check that it worked:
-- SELECT email, full_name, role FROM public.profiles WHERE role = 'admin';