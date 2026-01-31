# Authentication & Dashboard Setup Guide

## Overview

The AR Car Rentals application now includes:
- ✅ Phone-based authentication (instead of email)
- ✅ User registration with database storage
- ✅ Role-based access control (Customer vs Admin)
- ✅ Protected routes
- ✅ Customer dashboard
- ✅ Admin dashboard

## Quick Start

### 1. Database Setup

Run the SQL migration in your Supabase project:

```bash
# Navigate to database folder
cd database

# Open schema.sql and copy its contents
# Paste into Supabase SQL Editor and run
```

Or follow the detailed instructions in [database/README.md](database/README.md)

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from: Supabase Dashboard → Settings → API

### 3. Install & Run

```bash
npm install
npm run dev
```

## Features

### User Flows

#### New Customer Registration
1. User clicks "Book Now" (registration required)
2. Fills registration form with:
   - First & Last Name
   - Email
   - Phone Number (required for login)
   - Password (min 8 chars, must include uppercase, lowercase, and number)
3. Account is created in database with `customer` role
4. User is automatically logged in and redirected to Customer Dashboard

#### Customer Login
1. User navigates to Login page
2. Enters Phone Number and Password
3. Upon successful authentication, redirected to `/customer/dashboard`

#### Admin Login
1. Admin enters Phone Number and Password
2. System verifies admin role
3. Redirected to `/admin/dashboard`

### Role-Based Access Control

#### Protected Routes

| Route | Access | Redirect If Unauthorized |
|-------|--------|-------------------------|
| `/customer/dashboard` | Customers only | → `/login` |
| `/admin/dashboard` | Admins only | → `/customer/dashboard` |

#### Default Admin Account

After database setup, use this account to access admin features:
- **Phone**: +639123456789
- **Password**: admin123

**⚠️ Change this password immediately after first login!**

### Dashboard Features

#### Customer Dashboard
- View account information
- Track active bookings
- View rental history
- Browse available vehicles
- Update profile (coming soon)

#### Admin Dashboard
- Overview statistics (revenue, bookings, customers, fleet)
- Manage fleet vehicles
- View all bookings
- Manage customer accounts
- System settings
- Business analytics

## API Reference

### Authentication Service

Located in `src/services/authService.ts`

#### Methods

```typescript
// Register new user
const { user, error } = await authService.register({
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
});

// Login
const { user, error } = await authService.login(phone, password);

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();

// Check if admin
const isAdmin = authService.isAdmin(user);
```

### User Object

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin';
  createdAt: string;
}
```

## Security Considerations

### ⚠️ Critical: Password Hashing

**Current implementation stores passwords in PLAIN TEXT - NOT PRODUCTION SAFE!**

Before deploying to production:

1. Install bcrypt:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

2. Update `authService.ts` to hash passwords:

```typescript
import bcrypt from 'bcrypt';

// In register method:
password: await bcrypt.hash(data.password, 10),

// In login method:
const isValid = await bcrypt.compare(password, userData.password);
```

### Session Management

Currently uses `localStorage` for session storage. Consider:
- HTTP-only cookies for production
- JWT tokens with refresh mechanism
- Supabase Auth for more secure implementation

### Best Practices

1. **Never commit `.env` file** - already in `.gitignore`
2. **Rotate admin credentials** after initial setup
3. **Implement password reset** functionality
4. **Add email verification** for new accounts
5. **Enable 2FA** for admin accounts
6. **Implement rate limiting** on login attempts
7. **Add CAPTCHA** for registration/login forms
8. **Use HTTPS** in production
9. **Implement proper logging** for security events

## Navigation Updates

### Header Changes
- **Before**: "Sign Up" button
- **After**: "Book Now" button (requires registration)
- Login button remains in header

### Route Structure

```
/                          → Landing page
/login                     → Login page (phone + password)
/register                  → Registration page
/customer/dashboard        → Customer dashboard (protected)
/admin/dashboard          → Admin dashboard (protected, admin only)
```

## Testing

### Create Test Accounts

#### Via Registration Page
1. Go to `/register`
2. Fill in all fields
3. Submit form
4. Account created with `customer` role

#### Via SQL (for testing)
```sql
-- Create test customer
INSERT INTO users (first_name, last_name, email, phone, password, role)
VALUES ('Test', 'Customer', 'test@example.com', '+639111111111', 'password123', 'customer');

-- Create test admin
INSERT INTO users (first_name, last_name, email, phone, password, role)
VALUES ('Test', 'Admin', 'admin@example.com', '+639222222222', 'admin456', 'admin');
```

### Test Scenarios

1. **Customer Registration & Login**
   - Register new account
   - Verify redirect to customer dashboard
   - Logout and login again
   - Verify session persistence

2. **Admin Access**
   - Login with admin credentials
   - Verify redirect to admin dashboard
   - Attempt to access customer dashboard
   - Verify redirect to admin dashboard

3. **Protected Routes**
   - Try accessing `/customer/dashboard` without login
   - Verify redirect to `/login`
   - Login and verify access granted

4. **Validation**
   - Test with invalid phone number
   - Test with weak password
   - Test with duplicate phone/email
   - Verify error messages display correctly

## Troubleshooting

### "Supabase not configured" Error
- Check `.env` file exists
- Verify environment variable names
- Restart dev server after changing `.env`

### Login Fails with Correct Credentials
- Check database has user records
- Verify phone number format matches exactly
- Check browser console for detailed errors
- Verify Supabase connection is working

### Redirect Loop
- Clear localStorage: `localStorage.clear()`
- Check user role is set correctly in database
- Verify ProtectedRoute logic

### Database Connection Errors
- Verify Supabase project is active
- Check API keys are correct
- Check RLS policies are not blocking queries

## Next Steps

1. **Implement booking system** - Connect "Book Now" to vehicle selection
2. **Add password reset** - Email-based password recovery
3. **Implement proper password hashing** - Use bcrypt or argon2
4. **Add profile editing** - Allow users to update their information
5. **Create admin user management** - CRUD operations for users
6. **Add booking management** - Full booking lifecycle
7. **Implement fleet management** - Admin vehicle CRUD
8. **Add payment integration** - Process rental payments
9. **Email notifications** - Booking confirmations, reminders
10. **Analytics dashboard** - Revenue reports, usage statistics

## File Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── ...
├── contexts/
│   └── AuthContext.tsx           # Auth state management (optional)
├── pages/
│   ├── LoginPage.tsx             # Phone + password login
│   ├── RegisterPage.tsx          # User registration
│   ├── CustomerDashboardPage.tsx # Customer portal
│   └── AdminDashboardPage.tsx    # Admin portal
├── services/
│   ├── authService.ts            # Authentication logic
│   └── ...
└── routes/
    └── index.tsx                 # Route configuration

database/
├── schema.sql                    # Database migration
└── README.md                     # Database setup guide
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console errors
3. Check Supabase dashboard logs
4. Verify database schema is correctly applied

---

**Remember**: This is a development setup. Implement proper security measures before production deployment!
