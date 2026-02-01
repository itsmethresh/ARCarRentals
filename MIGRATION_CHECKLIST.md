# 🚀 Database Migration Checklist

## ✅ Code Changes (Completed)

The following files have been updated to work with the new schema:

- [x] `src/services/authService.ts` - Email-based login for admin/staff
- [x] `src/services/adminBookingService.ts` - Customer table integration
- [x] `src/pages/LoginPage.tsx` - Email input instead of phone
- [x] `src/pages/AdminDashboardPage.tsx` - Customer data display
- [x] `src/pages/AdminBookingsPage.tsx` - Customer reference
- [x] `src/components/ui/BookNowModal.tsx` - New booking creation flow
- [x] `src/contexts/AuthContext.tsx` - Email-based auth context

## 📋 Database Setup Steps

### Step 1: Backup Current Data (IMPORTANT!)
```sql
-- In Supabase SQL Editor, export your current data before proceeding
-- Tables to backup: bookings, users, vehicles
```

### Step 2: Apply New Schema
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Create new query
4. Copy content from: `database/apply_new_schema.sql`
5. Click **Run**
6. ✅ Verify: Check **Table Editor** to see new tables

### Step 3: Setup Storage Bucket
1. In Supabase SQL Editor
2. Copy content from: `database/setup_storage_bucket.sql`
3. Click **Run**
4. ✅ Verify: Go to **Storage** and see "bookings" bucket

### Step 4: Create Admin User
1. Go to **Authentication > Users** in Supabase
2. Click **Add user** (+ icon)
3. Choose **Create new user**
4. Fill in:
   - **Email**: `myuserisinvalid@gmail.com`
   - **Password**: `your-secure-password` (remember this!)
   - **Auto Confirm User**: ✅ (check this box)
5. Click **Create user**
6. ✅ Verify: User appears in auth.users table

### Step 5: Sync Admin User to Database
1. In Supabase SQL Editor
2. Copy content from: `database/setup_admin_user.sql`
3. Click **Run**
4. ✅ Verify: Check query results - should show admin user

### Step 6: Test Login
1. Open your app: http://localhost:5173/login
2. Enter:
   - **Email**: `myuserisinvalid@gmail.com`
   - **Password**: (the password you set)
3. Click **Sign In**
4. ✅ Verify: Redirected to admin dashboard

## 🧪 Testing Checklist

### Authentication
- [ ] Can login with email (not phone)
- [ ] Wrong password shows error
- [ ] Wrong email shows error
- [ ] Remember me works
- [ ] Logout works
- [ ] Protected routes redirect to login

### Admin Dashboard
- [ ] Dashboard loads without errors
- [ ] Stats display correctly
- [ ] Recent bookings show customer names
- [ ] No "Unknown" customer names
- [ ] Real-time updates work
- [ ] Refresh button works

### Bookings
- [ ] Can view all bookings
- [ ] Customer names display correctly
- [ ] Can search bookings
- [ ] Can filter by status
- [ ] Can view booking details
- [ ] Can update booking status

### Guest Booking Flow
- [ ] Can select vehicle
- [ ] Can fill customer details
- [ ] Can select dates/times
- [ ] Can upload payment receipt
- [ ] Receipt uploads to storage
- [ ] Booking creates successfully
- [ ] Customer record created in database
- [ ] Booking appears in admin dashboard immediately

### Vehicles
- [ ] Can view vehicle list
- [ ] Can search vehicles
- [ ] Can filter vehicles
- [ ] Vehicle details display

## 🔍 Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check admin user exists
SELECT * FROM users WHERE email = 'myuserisinvalid@gmail.com';

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'customers', 'bookings', 'vehicles', 'vehicle_categories', 'payments');

-- Check trigger exists
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'bookings';

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## ⚠️ Known Issues

### TypeScript Errors (Can Ignore)
- `RegisterPage.tsx` - Customer registration not implemented
- `CustomerDashboardPage.tsx` - Customer portal not implemented

**Reason**: New schema is for admin/staff only. Customer accounts not included in this update.

**Fix**: See `CUSTOMER_FEATURES_NOTE.md` for details.

## 📊 New Database Structure

```
users (admin/staff only)
  ↓
vehicle_categories
  ↓
vehicles ← booking_id ← bookings → customer_id → customers
                            ↓
                         payments
```

### Key Changes:
- ✅ Customers are separate from users
- ✅ One customer can have many bookings
- ✅ Guest bookings create customer records
- ✅ Admin users don't need customer records
- ✅ Email-based login for admin

## 🆘 Troubleshooting

### "User not found in database" error
- **Cause**: Auth user exists but not in public.users table
- **Fix**: Run `setup_admin_user.sql` again

### "Policy violation" error on booking
- **Cause**: RLS policies not set correctly
- **Fix**: Re-run `apply_new_schema.sql`

### Payment receipt not uploading
- **Cause**: Storage bucket doesn't exist or no public access
- **Fix**: Run `setup_storage_bucket.sql`

### Can't see bookings in real-time
- **Cause**: Real-time not enabled
- **Fix**: Check Supabase Realtime settings, enable for bookings table

### Customer name shows "Unknown"
- **Cause**: Customer record not created or no join
- **Fix**: Check booking has customer_id, check customers table

## 📝 After Migration

1. **Test thoroughly** before going live
2. **Re-import data** if you backed up
3. **Update environment variables** if needed
4. **Test on mobile** devices
5. **Check browser console** for errors
6. **Monitor Supabase logs** for issues

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Login with email works
- ✅ Dashboard shows stats
- ✅ Bookings display with customer names
- ✅ New bookings appear immediately
- ✅ Payment receipts upload
- ✅ No console errors
- ✅ Database queries are fast

## 📚 Documentation

- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Customer Features**: `CUSTOMER_FEATURES_NOTE.md`
- **Schema Reference**: `database/schema.sql`
- **Setup Scripts**: `database/` folder

## 🔗 Useful Links

- Supabase Dashboard: https://app.supabase.com
- Your Project URL: (check .env.local)
- Admin Login: http://localhost:5173/login

---

**Need Help?** Check the migration guide or review the code comments.
