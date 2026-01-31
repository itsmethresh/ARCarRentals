-- Add driver_license_url column to bookings table
-- This stores the URL/path to the uploaded driver's license image

ALTER TABLE bookings 
ADD COLUMN driver_license_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN bookings.driver_license_url IS 'URL/path to uploaded driver license image for self-drive bookings';

-- Optional: Add index if you'll query by this column frequently
-- CREATE INDEX idx_bookings_driver_license ON bookings(driver_license_url) WHERE driver_license_url IS NOT NULL;
