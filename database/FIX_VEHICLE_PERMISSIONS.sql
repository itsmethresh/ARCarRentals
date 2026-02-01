-- FIX PERMISSIONS FOR ADDING VEHICLES
-- Run this in Supabase SQL Editor

-- ========================================
-- STEP 1: Fix Storage Bucket Policies
-- ========================================

-- Drop all existing policies on storage.objects for vehicle-images
DROP POLICY IF EXISTS "Authenticated users can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete vehicle images" ON storage.objects;

-- Allow ANYONE (including anon) to upload to vehicle-images
CREATE POLICY "Anyone can upload vehicle images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow public read access
CREATE POLICY "Anyone can view vehicle images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Allow anyone to update
CREATE POLICY "Anyone can update vehicle images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow anyone to delete
CREATE POLICY "Anyone can delete vehicle images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'vehicle-images');

-- ========================================
-- STEP 2: Fix Vehicles Table Permissions
-- ========================================

-- Make sure RLS is DISABLED on vehicles table
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;

-- Re-grant all permissions to authenticated and anon
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO anon;

-- Also grant on all other tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ========================================
-- STEP 3: Verify Everything
-- ========================================

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'vehicles';

-- Check table permissions
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_schema = 'public' AND table_name = 'vehicles';

-- Check storage policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%vehicle%';

-- Expected results:
-- 1. vehicles table: rowsecurity = false
-- 2. anon and authenticated: SELECT, INSERT, UPDATE, DELETE
-- 3. Storage policies: 4 policies for vehicle-images
