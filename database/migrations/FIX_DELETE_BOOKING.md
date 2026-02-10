# Fix Delete Booking Issue

## Problem
The delete booking functionality in the admin panel doesn't work because Row Level Security (RLS) is enabled on the `bookings` and `payments` tables, but there are no DELETE policies defined. Without these policies, no one (not even admins) can delete records.

## Solution
Apply the DELETE policies by running the migration script.

## How to Apply This Fix

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `database/migrations/add_delete_policies.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the script

### Option 2: Supabase CLI
If you have the Supabase CLI installed:
```bash
supabase db execute --file database/migrations/add_delete_policies.sql
```

### Option 3: Direct SQL Client
If you're using a direct PostgreSQL client:
```bash
psql "your-connection-string" -f database/migrations/add_delete_policies.sql
```

## What This Does
The migration adds two new RLS policies:
- `Enable delete for admin payments` - Allows deletion of payment records
- `Enable delete for admin bookings` - Allows deletion of booking records

## Verification
After applying the migration:
1. Go to the Admin Bookings page
2. Try to delete a booking
3. It should now work successfully

## Note
The current policies allow anyone to delete (using `USING (true)`). In production, you may want to restrict this to authenticated admin users only. See the comments in the migration file for an example.
