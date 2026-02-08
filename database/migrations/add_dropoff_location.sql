-- Migration: Add dropoff_location column to bookings table
-- This allows separate pickup and drop-off locations with independent pricing

-- Add dropoff_location column (nullable, defaults to pickup_location value)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS dropoff_location TEXT;

-- Update existing bookings to have dropoff_location same as pickup_location
UPDATE bookings 
SET dropoff_location = pickup_location 
WHERE dropoff_location IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN bookings.dropoff_location IS 'Drop-off location for the vehicle (may differ from pickup location)';
