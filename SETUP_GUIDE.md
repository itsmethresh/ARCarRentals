# Quick Setup Guide - Phone Authentication with Supabase

## ✅ What's Already Done

- Your Supabase project is configured (.env file)
- Your existing schema (users, profiles, bookings, vehicles, etc.)
- Authentication service updated to use Supabase Auth
- Phone number login implemented

## 🚀 Next Steps

### Step 1: Run the SQL Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `database/schema.sql`
3. Paste and click **Run**

This will:
- Add `phone_number` column to profiles table
- Create auto-triggers for new user registration
- Set up security policies

### Step 2: Create Your First Admin Account

**Option A: Via Supabase Dashboard**
1. Go to **Authentication** → **Users** → **Add User**
2. Email: `admin@arcarrentals.com`
3. Password: `YourSecurePassword123!`
4. Click **Create User**
5. Go to **SQL Editor** and run:

```sql
-- Set as admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@arcarrentals.com';

-- Add phone number for login
UPDATE public.profiles
SET phone_number = '+639123456789',
    full_name = 'Admin User'
WHERE id = (SELECT id FROM public.users WHERE email = 'admin@arcarrentals.com');
```

**Option B: Register then Promote**
1. Register via the app at `/register`
2. Then run SQL to promote:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Step 3: Test the System

1. **Test Customer Registration**
   - Go to `/register`
   - Fill in: Full Name, Email, Phone (+63...), Password
   - Should redirect to customer dashboard

2. **Test Customer Login**
   - Go to `/login`
   - Enter phone number and password
   - Should redirect to customer dashboard

3. **Test Admin Login**
   - Go to `/login`
   - Enter admin phone (+639123456789) and password
   - Should redirect to admin dashboard

## 📱 Login Credentials

After setup, your admin account:
- **Phone**: +639123456789 (or whatever you set)
- **Email**: admin@arcarrentals.com
- **Password**: Whatever you chose

## 🔑 How It Works

### Registration Flow
```
User fills form → Supabase Auth creates account → 
Trigger creates profiles entry → Trigger creates users entry → 
User logged in → Redirect to customer dashboard
```

### Login Flow
```
User enters phone + password → Find profile by phone → 
Get email from users table → Supabase Auth login with email/password → 
Check role → Redirect to appropriate dashboard
```

### Role-Based Access
- **customer** → `/customer/dashboard`
- **staff** or **admin** → `/admin/dashboard`
- Protected routes check authentication and role
- Automatic redirects if wrong role

## 🎨 UI Changes

### Header
- ✅ "Sign Up" removed
- ✅ "Book Now" added (requires login to book)
- ✅ "Log In" remains

### Pages
- **Login**: Phone number + password
- **Register**: Full name, email, phone, password
- **Customer Dashboard**: Bookings, account info
- **Admin Dashboard**: Statistics, management tools

## 🔒 Security Features

✅ **Password Security**: Supabase Auth uses bcrypt automatically
✅ **Row Level Security**: Enabled on users and profiles
✅ **Role Verification**: Protected routes check user role
✅ **Session Management**: Supabase handles JWT tokens
✅ **SQL Injection Protection**: Parameterized queries

## 🐛 Troubleshooting

### "Invalid phone number or password"
- Check phone number format matches exactly (+63...)
- Verify account exists in Authentication → Users
- Check that profile has phone_number set

### Registration fails
- Check browser console for errors
- Verify .env variables are set
- Check Supabase project is active
- Ensure triggers are created (run schema.sql)

### Redirect loop or wrong dashboard
- Clear browser localStorage: `localStorage.clear()`
- Check user role in database
- Verify ProtectedRoute logic

### Can't access admin dashboard
- Verify role is 'admin' or 'staff':
```sql
SELECT email, role FROM public.users;
```

## 📝 Important Notes

1. **Phone numbers must be unique** - Each can only be used once
2. **Email addresses must be unique** - Managed by Supabase Auth
3. **Passwords** - Minimum 6 characters (Supabase default)
4. **Roles** - Can be: 'customer', 'staff', or 'admin'
5. **Auto-creation** - profiles and users records created automatically on signup

## 🚀 Production Checklist

Before going live:
- [ ] Change all default admin passwords
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up custom email templates
- [ ] Configure allowed redirect URLs
- [ ] Set up proper error logging
- [ ] Add rate limiting on login attempts
- [ ] Enable 2FA for admin accounts
- [ ] Review and update RLS policies
- [ ] Set up database backups
- [ ] Test all authentication flows

## 📚 Files Modified

- `src/services/authService.ts` - Supabase Auth integration
- `src/pages/LoginPage.tsx` - Phone number login
- `src/pages/RegisterPage.tsx` - Simplified to full name only
- `src/pages/CustomerDashboardPage.tsx` - Customer portal
- `src/pages/AdminDashboardPage.tsx` - Admin portal
- `src/components/ProtectedRoute.tsx` - Route protection
- `database/schema.sql` - Authentication setup
- `database/README.md` - Detailed documentation

---

**Need Help?** Check `database/README.md` for detailed setup instructions!
