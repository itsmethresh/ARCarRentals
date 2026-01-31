-- ========================================
-- STEP 1: CHECK IF COLUMNS EXIST
-- ========================================
-- Run this first to see what columns you currently have
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- If you DON'T see 'phone_number' and 'full_name' in the results above,
-- continue to STEP 2 below


-- ========================================
-- STEP 2: ADD THE MISSING COLUMNS
-- ========================================
-- Only run this if STEP 1 showed the columns are missing

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Make phone_number unique (but allow nulls for existing records)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_number_unique 
ON public.users(phone_number) WHERE phone_number IS NOT NULL;

-- Add regular index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_number 
ON public.users(phone_number);


-- ========================================
-- STEP 3: FIX RLS POLICIES
-- ========================================
-- This allows the login system to query users by phone number

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Remove old policies
DROP POLICY IF EXISTS "Allow public read for login" ON public.users;
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create new policy that allows reading for authentication
CREATE POLICY "Enable read access for authentication"
  ON public.users FOR SELECT
  USING (true);


-- ========================================
-- STEP 4: SET YOUR ADMIN PHONE NUMBER
-- ========================================
-- Update this with your actual admin email and desired phone number

UPDATE public.users 
SET phone_number = '+639773259391',
    full_name = 'Admin User',
    role = 'admin'
WHERE email = 'admin@arcarrentals.com';


-- ========================================
-- STEP 5: VERIFY IT WORKED
-- ========================================
-- Check your admin user has the phone number set

SELECT 
  id,
  email,
  role,
  full_name,
  phone_number,
  is_active,
  created_at
FROM public.users
WHERE email = 'admin@arcarrentals.com';

-- You should see something like:
-- email: admin@arcarrentals.com
-- role: admin
-- full_name: Admin User
-- phone_number: +639773259391
-- is_active: true
