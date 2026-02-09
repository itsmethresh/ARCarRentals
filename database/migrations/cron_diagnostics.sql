-- ============================================
-- CRON JOB DIAGNOSTICS
-- ============================================

-- 1. Check if the job is scheduled
SELECT jobid, schedule, command, jobname 
FROM cron.job;

-- 2. Check the last 5 runs
SELECT 
  jobname,
  status,
  start_time,
  end_time,
  return_message
FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 5;

-- 3. Check for any net request errors (if pg_net logs are available)
-- Note: pg_net doesn't always log to a table we can easily query, 
-- but we can check if the function ran successfully.

-- 4. Manually run the function and see what it returns
-- This is the best way to debug. If it returns rows, it TRIED to send.
-- If it returns nothing, it found no leads matching the criteria.
SELECT * FROM process_abandoned_leads();
