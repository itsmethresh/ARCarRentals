# Database Migration and Authentication Update Summary

## Overview
Updated the authentication system to use email-based login and updated booking services to work with the new normalized database schema that includes a separate `customers` table.

## Changes Made

### 1. Authentication Service (`authService.ts`)
- **Removed**: Phone-based login, `profiles` table references, customer-specific fields
- **Changed**: Login now uses email instead of phone number
- **Updated User Interface**:
  ```typescript
  interface User {
    id: string;
    email: string;
    role: 'staff' | 'admin';  // Removed 'customer' role
    isActive: boolean;
    // Removed: fullName, phoneNumber, profile
  }
  ```
- **New login method**: `login(email, password)` replaces `loginWithPhone(phone, password)`

### 2. Login Page (`LoginPage.tsx`)
- Changed from phone number input to email input
- Updated validation to check email format
- Updated localStorage keys from `admin_remembered_phone` to `admin_remembered_email`
- Changed icon from `Phone` to `Mail`

### 3. Admin Booking Service (`adminBookingService.ts`)
- **Added**: `Customer` interface and `CreateBookingData` interface
- **Updated Booking Interface**: Changed from `users` to `customers` foreign key
- **New `create()` method**: 
  - Creates or updates customer first
  - Then creates booking with `customer_id`
  - Supports guest bookings by checking email/phone
- **Updated queries**: All queries now join `customers` table instead of `users`
- **Added methods**: `updateStatus()`, `delete()`

### 4. Admin Dashboard Page (`AdminDashboardPage.tsx`)
- Updated booking display to use `customers.full_name` instead of `users.full_name`
- Removed `user.fullName` reference in welcome message

### 5. Book Now Modal (`BookNowModal.tsx`)
- Updated to use `adminBookingService.create()` instead of direct Supabase insert
- Automatically creates customer record when booking is made
- Maintains payment receipt upload functionality

## Database Setup Required

### Step 1: Apply New Schema
Run the SQL script in Supabase SQL Editor:
```
database/apply_new_schema.sql
```

This will:
- Create all tables with new structure
- Set up indexes for performance
- Configure RLS policies for security
- Set up triggers for timestamps

### Step 2: Setup Storage Bucket
Run the SQL script in Supabase SQL Editor:
```
database/setup_storage_bucket.sql
```

This creates the `bookings` storage bucket for payment receipts.

### Step 3: Create Admin User
1. In Supabase Dashboard, go to **Authentication > Users**
2. Click **Invite user** or **Add user**
3. Enter:
   - Email: `myuserisinvalid@gmail.com`
   - Password: (your secure password)
4. Create the user

5. Run the SQL script to sync the user to the `users` table:
```
database/setup_admin_user.sql
```

This will:
- Insert the auth user into `public.users` table with admin role
- Create a trigger to auto-sync future auth users
- Make the account active

## How to Use

### Admin Login
1. Navigate to `/login`
2. Enter email: `myuserisinvalid@gmail.com`
3. Enter password (the one you set in Supabase Auth)
4. Click "Sign In"

### Customer Bookings
When customers book through the website:
1. Customer fills out booking form
2. System creates/updates customer record in `customers` table
3. Booking is created with reference to customer
4. Payment receipt is uploaded to Supabase Storage
5. Admin can view booking with customer details in dashboard

## New Schema Structure

### Tables
1. **users** - Admin and staff accounts only
2. **vehicle_categories** - Vehicle categories (SUV, Sedan, etc.)
3. **vehicles** - Vehicle inventory
4. **customers** - All customers (both registered and guest)
5. **bookings** - Bookings with customer_id reference
6. **payments** - Payment records

### Key Relationships
- `vehicles.category_id` → `vehicle_categories.id`
- `bookings.customer_id` → `customers.id`
- `bookings.vehicle_id` → `vehicles.id`
- `payments.booking_id` → `bookings.id`

## Benefits

1. **Normalized Data**: No duplicate customer information
2. **Better Tracking**: One customer can have multiple bookings
3. **Simpler Auth**: Email-based login is more standard
4. **Clean Separation**: Admin users vs. customers are separate
5. **Scalability**: Easy to add customer features later

## Testing Checklist

After running the SQL scripts:

- [ ] Can login with admin email
- [ ] Dashboard loads without errors
- [ ] Can view existing bookings
- [ ] Can create new booking (test guest booking)
- [ ] Customer information displays correctly
- [ ] Payment receipts upload successfully
- [ ] Real-time updates work
- [ ] Search and filters work

## Important Notes

- **Backup your data** before running migration scripts
- The migration will **drop existing tables** and recreate them
- You'll need to **re-import** any existing data after migration
- Update any other services/APIs that interact with the database
- Test thoroughly before going live

## Next Steps

1. Run `apply_new_schema.sql` in Supabase
2. Run `setup_storage_bucket.sql` in Supabase
3. Create admin user in Supabase Auth dashboard
4. Run `setup_admin_user.sql` in Supabase
5. Test login with new email credentials
6. Test creating a booking
7. Verify all dashboard features work
