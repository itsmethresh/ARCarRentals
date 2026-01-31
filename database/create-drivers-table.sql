-- ========================================
-- CREATE DRIVERS TABLE
-- ========================================
-- This table stores professional drivers that customers can hire with their rentals

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  profile_photo TEXT, -- URL to photo
  
  -- Driver Details
  license_number VARCHAR(50) NOT NULL UNIQUE,
  license_expiry DATE NOT NULL,
  years_of_experience INTEGER DEFAULT 0,
  
  -- Employment & Availability
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'on_duty', 'unavailable')),
  rate_per_day DECIMAL(10, 2) NOT NULL,
  
  -- Additional Info
  languages_spoken TEXT[], -- Array of languages e.g., ['English', 'Tagalog', 'Cebuano']
  specializations TEXT[], -- e.g., ['Long Distance', 'Luxury Cars', 'SUV/Trucks']
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON public.drivers(phone_number);
CREATE INDEX IF NOT EXISTS idx_drivers_license ON public.drivers(license_number);

-- ========================================
-- RLS POLICIES
-- ========================================
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read drivers
CREATE POLICY "Enable read access for authenticated users"
  ON public.drivers FOR SELECT
  USING (true);

-- Only admins can insert, update, delete
CREATE POLICY "Enable insert for admins"
  ON public.drivers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Enable update for admins"
  ON public.drivers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Enable delete for admins"
  ON public.drivers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ========================================
-- TRIGGER FOR UPDATED_AT
-- ========================================
CREATE OR REPLACE FUNCTION update_drivers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_drivers_updated_at();

-- ========================================
-- ADD DRIVER_ID TO BOOKINGS TABLE
-- ========================================
-- This allows customers to request a driver with their booking

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_driver ON public.bookings(driver_id);

-- ========================================
-- SAMPLE DATA (OPTIONAL)
-- ========================================
-- Uncomment to add sample drivers

/*
INSERT INTO public.drivers (
  full_name, 
  phone_number, 
  email, 
  license_number, 
  license_expiry, 
  years_of_experience,
  rate_per_day,
  status,
  languages_spoken,
  specializations,
  profile_photo
) VALUES 
(
  'Juan Santos',
  '+639123456789',
  'juan.santos@arcarrentals.com',
  'N01-12-345678',
  '2027-12-31',
  10,
  1500.00,
  'available',
  ARRAY['English', 'Tagalog', 'Cebuano'],
  ARRAY['Long Distance', 'Luxury Cars'],
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
),
(
  'Maria Cruz',
  '+639987654321',
  'maria.cruz@arcarrentals.com',
  'N01-98-765432',
  '2026-06-30',
  5,
  1200.00,
  'available',
  ARRAY['English', 'Tagalog'],
  ARRAY['City Driving', 'Airport Transfer'],
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
),
(
  'Pedro Reyes',
  '+639555123456',
  'pedro.reyes@arcarrentals.com',
  'N01-55-123456',
  '2028-03-15',
  15,
  2000.00,
  'available',
  ARRAY['English', 'Tagalog', 'Bisaya'],
  ARRAY['Long Distance', 'SUV/Trucks', 'Mountain Roads'],
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
);
*/

-- ========================================
-- VERIFY TABLE CREATION
-- ========================================
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'drivers'
ORDER BY ordinal_position;
