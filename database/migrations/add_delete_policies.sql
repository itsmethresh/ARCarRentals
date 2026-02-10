-- Add DELETE policies for bookings and payments
-- This allows admins to delete bookings and payments

-- Delete policy for payments (must be created first due to foreign key)
CREATE POLICY "Enable delete for admin payments" ON payments
  FOR DELETE
  USING (true);

-- Delete policy for bookings
CREATE POLICY "Enable delete for admin bookings" ON bookings
  FOR DELETE
  USING (true);

-- Note: In production, you may want to restrict these to authenticated admin users only
-- Example: USING (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
