-- AR Car Rentals - Phone Authentication Migration
-- Run this ONCE in your Supabase SQL Editor to add phone authentication

-- Step 1: Add phone_number and full_name columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Step 2: Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);

-- Step 3: Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user record with phone_number and full_name
  INSERT INTO public.users (id, email, role, phone_number, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET phone_number = EXCLUDED.phone_number,
      full_name = EXCLUDED.full_name;
  
  -- Also create profile record if it doesn't exist (for other profile data)
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger to auto-create profile and user record when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow public read for login" ON public.users;

-- Step 7: Create RLS policies for users
-- Allow reading for login verification (phone lookup)
CREATE POLICY "Allow public read for login"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
    )
  );

-- Step 8: Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 9: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
on profiles if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Step 10: Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
    )
  );

-- Done! Phone number is now in users table for easier access
COMMENT ON COLUMN public.users.phone_number IS 'Phone number used for login authentication';
COMMENT ON COLUMN public.users.full_name IS 'User full name for display