-- Quick Admin Promotion Script
-- Replace 'your-email@example.com' with the actual email you use to login

-- Step 1: Check current profiles
SELECT email, full_name, role FROM public.profiles;

-- Step 2: Promote user to admin (replace with your email)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Step 3: Verify the change
SELECT email, full_name, role FROM public.profiles WHERE role = 'admin';