-- Setup Storage Buckets for Application
-- Run this in Supabase SQL Editor

-- ========================================
-- VEHICLE IMAGES BUCKET
-- ========================================

-- Create the 'vehicle-images' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing vehicle-images policies
DROP POLICY IF EXISTS "Authenticated users can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete vehicle images" ON storage.objects;

-- Allow authenticated users to upload vehicle images
CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow public read access to vehicle images
CREATE POLICY "Public can view vehicle images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to update vehicle images
CREATE POLICY "Authenticated users can update vehicle images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to delete vehicle images
CREATE POLICY "Authenticated users can delete vehicle images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- ========================================
-- PAYMENT RECEIPTS / BOOKINGS BUCKET
-- ========================================

-- Create the 'bookings' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('bookings', 'bookings', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to payment-receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to bookings bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete files" ON storage.objects;

-- Create policy to allow anyone to upload to payment-receipts folder
CREATE POLICY "Allow public uploads to payment-receipts"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'bookings' 
  AND (storage.foldername(name))[1] = 'payment-receipts'
);

-- Create policy to allow anyone to view files in bookings bucket
CREATE POLICY "Allow public access to bookings bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bookings');

-- Create policy to allow authenticated users to update their uploads
CREATE POLICY "Allow users to update their uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bookings')
WITH CHECK (bucket_id = 'bookings');

-- Create policy to allow admins to delete files
CREATE POLICY "Allow admins to delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bookings');

-- Verify the buckets were created
SELECT * FROM storage.buckets WHERE id IN ('vehicle-images', 'bookings');
