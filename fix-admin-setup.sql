-- Step 1: Check if profiles table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Step 2: If no results, run the full schema first
-- (Copy and paste the entire supabase-schema.sql file)

-- Step 3: Check current profiles
SELECT id, email, full_name, role FROM public.profiles;

-- Step 4: Promote your user to admin (replace with your email)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'joelyahaya7@gmail.com';

-- Step 5: Verify the change
SELECT email, full_name, role FROM public.profiles WHERE role = 'admin';