-- Create the receipts storage bucket
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)

-- 1. Create the bucket (public so receipt images can be viewed by admin)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  true,
  10485760,  -- 10 MB max
  ARRAY['image/jpeg','image/jpg','image/png','image/gif','image/webp','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/gif','image/webp','application/pdf'];

-- 2. Drop any conflicting storage policies
DROP POLICY IF EXISTS "receipts_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "receipts_public_select" ON storage.objects;
DROP POLICY IF EXISTS "receipts_public_update" ON storage.objects;
DROP POLICY IF EXISTS "receipts_public_delete" ON storage.objects;

-- 3. Allow anyone to upload receipts (members submitting payment proof)
CREATE POLICY "receipts_public_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts');

-- 4. Allow anyone to read receipts (admin viewing uploaded receipts)
CREATE POLICY "receipts_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts');

-- 5. Allow overwrite / re-upload
CREATE POLICY "receipts_public_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'receipts');

-- 6. Verify — should return the bucket row
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'receipts';
