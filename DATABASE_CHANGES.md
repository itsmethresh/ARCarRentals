# Database Schema Update - Booking Details

## Summary
Updated the booking system to use **phone number authentication** and added **dedicated columns** to the bookings table for better data management.

## Changes Made

### 1. Phone Number Authentication ✅
- **Login**: Users now login with phone number instead of email
- **Registration**: Phone number is the primary identifier
  - Phone format validation: `09XXXXXXXXX` (Philippine format)
  - Auto-generates email for Supabase auth: `phone@arcars.temp`
  - Checks for duplicate phone numbers before registration
- **Login Flow**: 
  1. User enters phone number + password
  2. System finds user profile by phone
  3. Retrieves associated email from users table
  4. Authenticates with Supabase using email/password
  5. Pre-fills customer details from profile

### 2. Database Schema - Recommended Approach ✅

**Decision: Add specific columns to `bookings` table**

#### Why Columns Instead of Separate Table?
- ✅ Better query performance (no joins needed)
- ✅ Simpler data model for this use case
- ✅ Direct foreign key constraints
- ✅ Easier to index frequently-searched fields
- ✅ Data validation via CHECK constraints
- ✅ Still have JSONB `extras` field for flexibility

#### New Columns Added

```sql
-- Customer Information
customer_name TEXT
customer_phone TEXT NOT NULL  -- Primary contact method
customer_email TEXT            -- Optional (may be auto-generated)
customer_address TEXT

-- Booking Details
drive_option TEXT CHECK (drive_option IN ('self-drive', 'with-driver'))
destination TEXT
number_of_passengers INTEGER DEFAULT 1
start_time TIME
end_time TIME

-- Payment
payment_method TEXT CHECK (payment_method IN ('pay_now', 'pay_later'))
payment_receipt_url TEXT
```

#### Indexes Created
- `idx_bookings_customer_phone` - Fast customer lookup
- `idx_bookings_payment_status` - Filter by payment status
- `idx_bookings_status` - Filter by booking status

## Implementation Steps

### Step 1: Run Database Migration
Execute the SQL migration file in Supabase:

```bash
database/migrations/add_booking_details_columns.sql
```

**Important**: This migration is **safe to run** - it uses `IF NOT EXISTS` so it won't fail if columns already exist.

### Step 2: Updated Code Files
- ✅ `src/components/ui/BookNowModal.tsx` - Phone auth + new booking columns
- ✅ Uses new columns for booking submission
- ✅ Validates phone number format
- ✅ Handles phone-based login/registration

## Data Flow

### Registration:
```
User Input: Phone (09123456789) + Password + Name
     ↓
Generate Email: 09123456789@arcars.temp
     ↓
Supabase Auth: Create user with generated email
     ↓
Profile Table: Store phone, full_name, address
     ↓
User can now login with phone number
```

### Login:
```
User Input: Phone (09123456789) + Password
     ↓
Query profiles table by phone
     ↓
Get associated email from users table
     ↓
Supabase Auth: signInWithPassword(email, password)
     ↓
Pre-fill booking form with profile data
```

### Booking Submission:
```
Collect all form data
     ↓
Insert into bookings table with:
  - Standard fields (user_id, vehicle_id, dates, prices)
  - Customer details (name, phone, email, address)
  - Booking details (drive_option, destination, passengers, times)
  - Payment info (payment_method, receipt_url)
  - Extras JSONB (vehicle info for reference)
     ↓
Booking saved and visible in admin panel
```

## Benefits

### Performance
- Direct queries on indexed columns
- No JOIN overhead for common queries
- Fast filtering by customer phone, status, payment status

### Data Integrity
- CHECK constraints ensure valid values
- NOT NULL on customer_phone ensures contact info
- Foreign keys maintain referential integrity
- Type safety (TEXT, INTEGER, TIME)

### Developer Experience
- Clear column names (self-documenting)
- Easy to write queries
- TypeScript types match database schema
- Simpler than managing separate tables

### Flexibility
- JSONB `extras` field still available for:
  - Additional metadata
  - Feature flags
  - Temporary data during development
  - Custom fields per booking type

## Testing Checklist

- [ ] Run migration in Supabase SQL editor
- [ ] Test registration with phone number
- [ ] Test login with phone number
- [ ] Test booking submission
- [ ] Verify booking appears in admin panel with all details
- [ ] Check that customer_phone is searchable
- [ ] Verify payment_method values are constrained
- [ ] Test duplicate phone number registration (should fail)

## Notes

- Phone numbers stored without special formatting
- System validates Philippine format (09XXXXXXXXX)
- Generated emails use domain: `@arcars.temp`
- Password requirements: minimum 6 characters
- All booking fields properly typed and constrained
- Migration is idempotent (safe to run multiple times)
