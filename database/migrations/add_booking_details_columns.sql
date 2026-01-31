-- Migration: Add booking details columns to bookings table
-- This adds specific columns for frequently-queried booking details
-- instead of relying solely on the JSONB extras field

-- Add customer information columns
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Add booking-specific details
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS drive_option TEXT CHECK (drive_option IN ('self-drive', 'with-driver')),
  ADD COLUMN IF NOT EXISTS destination TEXT,
  ADD COLUMN IF NOT EXISTS number_of_passengers INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS end_time TIME;

-- Add payment information
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('pay_now', 'pay_later')),
  ADD COLUMN IF NOT EXISTS payment_receipt_url TEXT;

-- Create index on customer_phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON public.bookings(customer_phone);

-- Create index on payment_status for filtering
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Add comment explaining the columns
COMMENT ON COLUMN public.bookings.customer_name IS 'Customer full name for this booking';
COMMENT ON COLUMN public.bookings.customer_phone IS 'Customer contact phone number (required for communication)';
COMMENT ON COLUMN public.bookings.customer_email IS 'Customer email address (optional, may be auto-generated)';
COMMENT ON COLUMN public.bookings.customer_address IS 'Customer residential address';
COMMENT ON COLUMN public.bookings.drive_option IS 'Whether customer wants self-drive or with-driver service';
COMMENT ON COLUMN public.bookings.destination IS 'Planned destination for the trip';
COMMENT ON COLUMN public.bookings.number_of_passengers IS 'Number of passengers for the booking';
COMMENT ON COLUMN public.bookings.payment_method IS 'Whether customer pays now (online) or later (on pickup)';
COMMENT ON COLUMN public.bookings.payment_receipt_url IS 'URL to uploaded payment receipt (for pay_now bookings)';

-- Note: The 'extras' JSONB column can still be used for additional
-- flexible data that doesn't need to be queried frequently
