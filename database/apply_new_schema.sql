-- Apply New Clean Schema to Database
-- Run this in Supabase SQL Editor
-- BACKUP YOUR DATABASE FIRST!

-- =====================================================
-- Step 1: Drop old tables and create new structure
-- =====================================================

-- Drop all existing tables
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.vehicle_categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Recreate users table
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin'::text CHECK (role = ANY (ARRAY['admin'::text, 'staff'::text])),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Create vehicle_categories table
CREATE TABLE public.vehicle_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  CONSTRAINT vehicle_categories_pkey PRIMARY KEY (id)
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  brand text NOT NULL,
  model text NOT NULL,
  color text,
  transmission text NOT NULL DEFAULT 'automatic'::text CHECK (transmission = ANY (ARRAY['automatic'::text, 'manual'::text])),
  fuel_type text NOT NULL DEFAULT 'gasoline'::text CHECK (fuel_type = ANY (ARRAY['gasoline'::text, 'diesel'::text, 'electric'::text, 'hybrid'::text])),
  seats integer NOT NULL DEFAULT 5,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  price_per_day numeric NOT NULL,
  status text NOT NULL DEFAULT 'available'::text CHECK (status = ANY (ARRAY['available'::text, 'rented'::text, 'maintenance'::text, 'retired'::text])),
  is_featured boolean NOT NULL DEFAULT false,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_category_fk FOREIGN KEY (category_id) REFERENCES public.vehicle_categories(id) ON DELETE SET NULL
);

-- Create customers table (independent, no booking_id)
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  contact_number text NOT NULL,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

-- Create bookings table (with customer_id reference)
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  start_date date NOT NULL,
  start_time time without time zone NOT NULL,
  rental_days integer NOT NULL CHECK (rental_days > 0),
  pickup_location text NOT NULL,
  total_amount numeric NOT NULL,
  booking_status text NOT NULL DEFAULT 'pending'::text CHECK (booking_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_customer_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  CONSTRAINT bookings_vehicle_fk FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);

-- Create payments table
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  payment_method text NOT NULL CHECK (payment_method = ANY (ARRAY['cash'::text, 'gcash'::text, 'card'::text, 'bank_transfer'::text])),
  amount numeric NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text])),
  transaction_reference text,
  payment_proof_url text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE
);

-- =====================================================
-- Step 2: Create Indexes for Performance
-- =====================================================

-- Vehicles indexes
CREATE INDEX idx_vehicles_category ON public.vehicles(category_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_featured ON public.vehicles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_vehicles_price ON public.vehicles(price_per_day);

-- Bookings indexes
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_start_date ON public.bookings(start_date);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);

-- Customers indexes
CREATE INDEX idx_customers_contact ON public.customers(contact_number);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_name ON public.customers(full_name);

-- Payments indexes
CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- =====================================================
-- Step 3: Create updated_at Trigger Function
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Step 4: Enable RLS and Create Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES (Admin/Staff only)
CREATE POLICY "Authenticated users can view users"
ON public.users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can insert users"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update users"
ON public.users FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- VEHICLE CATEGORIES POLICIES
CREATE POLICY "Anyone can view vehicle categories"
ON public.vehicle_categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage categories"
ON public.vehicle_categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- VEHICLES POLICIES
CREATE POLICY "Anyone can view available vehicles"
ON public.vehicles FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage vehicles"
ON public.vehicles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicles"
ON public.vehicles FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicles"
ON public.vehicles FOR DELETE
TO authenticated
USING (true);

-- BOOKINGS POLICIES
CREATE POLICY "Anyone can view bookings"
ON public.bookings FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (true);

-- CUSTOMERS POLICIES
CREATE POLICY "Anyone can view customers"
ON public.customers FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create customer records"
ON public.customers FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
ON public.customers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- PAYMENTS POLICIES
CREATE POLICY "Anyone can view payments"
ON public.payments FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create payments"
ON public.payments FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update payments"
ON public.payments FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- Step 5: Insert Default Vehicle Categories
-- =====================================================

INSERT INTO public.vehicle_categories (name, description) VALUES
  ('Sedan', 'Comfortable 4-door passenger cars'),
  ('SUV', 'Sport Utility Vehicles for all terrains'),
  ('Van', 'Spacious vehicles for families and groups'),
  ('Pickup', 'Trucks for cargo and utility'),
  ('Luxury', 'Premium high-end vehicles')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- Step 6: Verification
-- =====================================================

-- Check all tables
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
