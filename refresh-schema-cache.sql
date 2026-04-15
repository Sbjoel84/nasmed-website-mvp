-- Force Supabase to refresh its schema cache
-- Run this in Supabase SQL Editor after adding new columns

-- This will invalidate the schema cache for the applications table
NOTIFY pgrst, 'reload schema';

-- Alternative: You can also restart your Supabase project from the dashboard
-- Settings → General → Restart project

-- Or simply wait 5-10 minutes for automatic cache refresh