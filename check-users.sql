-- Check what users exist in your Supabase database
-- Run this in Supabase SQL Editor

-- Check auth users (this shows all registered users)
SELECT id, email, created_at FROM auth.users;

-- Check profiles table (this shows user profiles with roles)
SELECT id, email, full_name, role FROM public.profiles;

-- Check if your specific user exists
SELECT id, email, full_name, role FROM public.profiles
WHERE email = 'joelyahaya7@gmail.com';

-- If no results, you need to create the user account first in Supabase Auth dashboard