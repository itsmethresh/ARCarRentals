# Database Setup Instructions

This directory contains the authentication setup for AR Car Rentals using your existing Supabase schema.

## Overview

Your existing schema already includes:
- `auth.users` table (Supabase Auth) - handles authentication
- `public.users` table - stores user roles and status
- `public.profiles` table - stores extended user information

We just need to add phone number authentication support.

## Initial Setup

### 1. Ensure Supabase Project is Ready

Your existing schema should already be set up. If not:
1. Go to [supabase.com](https://supabase.com) and access your project
2. Verify your tables exist in the Table Editor

### 2. Run Authentication Migration

1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Click **New Query**
4. Copy and paste the contents of `schema.sql` into the editor
5. Click **Run** to execute the SQL

This will:
- Add `phone_number` column to the profiles table
- Create triggers to auto-create profiles and user records
- Set up Row Level Security policies

### 3. Configure Environment Variables

Your `.env` file should already have:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Database Schema

### Authentication Flow

1. **auth.users** (Supabase Auth)
   - Handles email/password authentication
   - Managed by Supabase

2. **public.users** 
   - Links to auth.users via foreign key
   - Stores role (customer, staff, admin)
   - Stores account status (is_active)

3. **public.profiles**
   - Stores extended user information
   - **phone_number** - Used for login (newly added)
   - full_name, address, city, avatar_url, etc.

### Updated Profiles Table

After running the migration, your profiles table will have:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users(id) |
| full_name | TEXT | User's full name |
| phone | TEXT | Contact phone (optional) |
| phone_number | VARCHAR(20) | Phone number for login (unique) |
| address | TEXT | User's address |
| city | TEXT | User's city |
| avatar_url | TEXT | Profile picture URL |
| driver_license_number | TEXT | License number |
| driver_license_expiry | DATE | License expiry date |
| date_of_birth | DATE | User's date of birth |
| created_at | TIMESTAMP | Profile creation time |
| updated_at | TIMESTAMP | Last update time |

## Creating Admin Accounts

Since we use Supabase Auth, you cannot directly insert into auth.users. Instead:

### Option 1: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. After creation, go to **SQL Editor** and run:

```sqlSecurity

✅ **Good News**: Supabase Auth handles password hashing automatically using bcrypt!

You don't need to implement password hashing yourself. Supabase securely:
- Hashes passwords before storage
- Validates passwords during login
- Never exposes plain text passwordsATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Security Notes

### Password Hashing

The current implementation stores passwords in **plain text**, which is **NOT SECURE** for production use.

**Before going to production**, you MUST implement proper password hashing:

1. Use bcrypt, argon2, or scrypt for password hashing
2. Update the authentication service to hash passwords before storing
3. Update the login service to verify hashed passwords

Example with bcrypt:
```typescript
import bcrypt from 'bcrypt';

// When registering
const hashedPassword = await bcrypt.hash(password, 10);

// When logging in
const isValid = await bcrypt.compare(password, user.password);
```

### Row Level Security (RLS)

The schema includes basic RLS policies:
- Users can read all user data (for login)
- Users can register as customers only
- Users can update only their own data
- Admins can read all user data

## Testing

### Create Test Accounts

#### Via Registration Page (Recommended)
1. Go to `/register` in your app
2. Fill in the form with:
   - Full Name: "Test Customer"
   - Email: "test@example.com"
   - Phone Number: "+639111111111"
   - Password: "Test1234!"
3. Submit and verify account creation

#### Verify Registration

```sql
-- View all users with their profiles
SELECT 
  u.id,
  u.email,
  u.role,
  u.is_active,
  p.full_name,
  p.phone_number,
  u.created_at
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Count users by role
SELECT role, COUNT(*) 
FROM public.users 
GROUP BY role;
```

## Troubleshooting

### Connection Issues

If you see "Supabase environment variables are not set" warning:
1. Verify `.env` file exists in project root
2. Check that variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart the development server after updating `.env`

### RLS Errorsphone_number is set in profiles table
2. Verify phone number format matches exactly (including country code)
3. Check browser console for detailed error messages
4. Verify Supabase Auth is working (check Authentication → Users in dashboard)
5. Ensure RLS policies are not blocking queri
1. Check that RLS policies are properly created
2. Temporarily disable RLS for testing (not recommended for production)
3. Verify user roles are set correctly

### Login Issues

If login fails even with correct credentials:
1. Check that the users table has data
2. Verify phone number format matches exactly
3. Check browser console for detailed error messages
