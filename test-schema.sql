-- Quick test to verify applications table works
-- Run this after the main schema to test if everything is set up correctly

-- Test insert (should work)
INSERT INTO public.applications (
  full_name, email, phone, profession, membership_type, state, statement
) VALUES (
  'Test User', 'test@example.com', '+2341234567890', 'Doctor', 'Professional Member', 'Lagos', 'Test application statement'
);

-- Test select (should return the test record)
SELECT id, full_name, email, status FROM public.applications WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM public.applications WHERE email = 'test@example.com';