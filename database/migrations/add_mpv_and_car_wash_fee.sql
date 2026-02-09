-- Migration: Add MPV category and car wash fee
-- Description: Adds Multi-Purpose Vehicle category and car_wash_fee column to vehicles table
-- Date: 2024

-- ============================================
-- 1. Add MPV to vehicle_categories table
-- ============================================
INSERT INTO vehicle_categories (id, name, description)
VALUES (
  gen_random_uuid(),
  'Multi-Purpose Vehicle',
  'Versatile vehicles suitable for families and groups'
)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. Add car_wash_fee column to vehicles table
-- ============================================
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS car_wash_fee DECIMAL(10,2) DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN vehicles.car_wash_fee IS 'Car wash fee charged when customer selects self-drive option';

-- ============================================
-- Verification queries (optional - run to verify)
-- ============================================
-- SELECT * FROM vehicle_categories ORDER BY name;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'car_wash_fee';
