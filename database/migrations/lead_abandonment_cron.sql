-- ============================================
-- CRON JOB: Lead Abandonment Automation
-- ============================================
-- This cron job runs every 10 minutes to:
-- 1. Find PENDING leads older than 60 minutes
-- 2. Mark them as ABANDONED
-- 3. Queue them for abandoned cart email
--
-- Prerequisites:
-- - pg_cron extension must be enabled in Supabase
-- - Run this in Supabase SQL Editor
-- ============================================

-- Enable pg_cron and pg_net extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- DROP existing function first to avoid return type errors
DROP FUNCTION IF EXISTS process_abandoned_leads();

-- ============================================
-- FUNCTION: Process abandoned leads
-- ============================================
CREATE OR REPLACE FUNCTION process_abandoned_leads()
RETURNS TABLE(
  lead_id UUID,
  result_email VARCHAR,
  result_lead_name VARCHAR,
  result_status INT
) AS $$
DECLARE
  abandoned_lead RECORD;
  request_id INT;
  payload JSONB;
BEGIN
  -- 1. Identify and update abandoned leads using a temporary table or CTE approach that works with FOR loop
  -- We'll use a slightly different approach: UPDATE and store in temp table, then loop
  
  CREATE TEMP TABLE updated_leads AS
  WITH updated_rows AS (
    UPDATE abandoned_leads
    SET 
      status = 'abandoned',
      automation_status = 'sent',
      automation_sent_at = NOW()
    WHERE 
      abandoned_leads.status = 'pending'
      AND recovered_booking_id IS NULL
      AND created_at < NOW() - INTERVAL '2 minutes' -- Testing: 2 mins
      AND automation_status = 'not_sent'
    RETURNING id, email, lead_name, vehicle_id, pickup_date, return_date, estimated_price
  )
  SELECT * FROM updated_rows;

  -- 2. Loop through the updated leads
  FOR abandoned_lead IN SELECT * FROM updated_leads
  LOOP
    -- Fetch vehicle name
    DECLARE
      v_name TEXT;
    BEGIN
      SELECT brand || ' ' || model INTO v_name FROM vehicles WHERE id = abandoned_lead.vehicle_id;
      
      -- Construct Payload
      payload := jsonb_build_object(
        'email', abandoned_lead.email,
        'bookingReference', 'ABANDONED',
        'magicLink', 'https://arcarrentalscebu.com/browsevehicles',
        'emailType', 'abandoned_cart',
        'abandonedCartDetails', jsonb_build_object(
          'customerName', abandoned_lead.lead_name,
          'vehicleName', COALESCE(v_name, 'Your Selected Vehicle'),
          'pickupDate', abandoned_lead.pickup_date,
          'returnDate', abandoned_lead.return_date,
          'estimatedPrice', abandoned_lead.estimated_price,
          'resumeLink', 'https://arcarrentalscebu.com/browsevehicles'
        )
      );

      -- Call Edge Function
      PERFORM net.http_post(
        url := 'https://dnexspoyhhqflatuyxje.supabase.co/functions/v1/send-booking-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZXhzcG95aGhxZmxhdHV5eGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzEwNDYsImV4cCI6MjA4NTM0NzA0Nn0.XUfhz6dvVjYFx4n89MuEvteOHGIeXaCKydYSyP2KX-M'
        ),
        body := payload
      );
      
      -- Return result
      lead_id := abandoned_lead.id;
      result_email := abandoned_lead.email;
      result_lead_name := abandoned_lead.lead_name;
      result_status := 200;
      RETURN NEXT;
    END;
  END LOOP;
  
  -- Cleanup
  DROP TABLE updated_leads;
  
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CRON SCHEDULE: Run every 10 minutes
-- ============================================
-- NOTE: Uncomment the lines below to enable the cron job
-- The cron will call an edge function to send emails

-- SELECT cron.schedule(
--   'process-abandoned-leads',           -- Job name
--   '*/10 * * * *',                       -- Every 10 minutes
--   $$
--     SELECT * FROM process_abandoned_leads();
--   $$
-- );

-- ============================================
-- ALTERNATIVE: Edge Function Trigger
-- ============================================
-- If you want to trigger an edge function for emails,
-- use this modified approach:

-- 1. Create a webhook/edge function to send emails
-- 2. The cron job marks leads as abandoned
-- 3. A Supabase Realtime listener or webhook picks up changes

-- For immediate testing, you can run:
-- SELECT * FROM process_abandoned_leads();

-- ============================================
-- MANUAL TRIGGER: For testing
-- ============================================
-- Call this to immediately process abandoned leads:
-- SELECT * FROM process_abandoned_leads();

-- ============================================
-- CLEANUP: Remove cron job (if needed)
-- ============================================
-- SELECT cron.unschedule('process-abandoned-leads');

-- ============================================
-- VIEW: Check scheduled jobs
-- ============================================
-- SELECT * FROM cron.job;

-- ============================================
-- VIEW: Check job run history
-- ============================================
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
