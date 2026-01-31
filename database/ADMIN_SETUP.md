# Creating Your First Admin Account

Follow these steps **IN ORDER** after running the migration.

## Step 1: Run the Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy **ALL** contents from `migration.sql`
3. Click **Run**
4. Wait for "Success. No rows returned" message

## Step 2: Create Admin User in Supabase

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add User"** (or **"Invite"** button)
3. Choose **"Create new user"**
4. Fill in:
   - **Email**: `admin@arcarrentals.com`
   - **Password**: Choose a secure password (e.g., `Admin123!@#`)
   - Leave **Auto Confirm User** CHECKED ✅
5. Click **"Create user"** or **"Send"**

## Step 3: Update User Role and Phone Number

1. Go back to **SQL Editor**
2. Run this query (replace the phone number if you want):

```sql
-- Set user as admin and add phone number
UPDATE public.users 
SET role = 'admin',
    phone_number = '+639123456789',
    full_name = 'Admin User'
WHERE email = 'admin@arcarrentals.com';
```

3. You should see: **"Success. 1 row updated"**

## Step 4: Verify Admin Account

Run this to check:

```sql
SELECT 
  email,
  role,
  full_name,
  phone_number,
  is_active
FROM public.users
WHERE email = 'admin@arcarrentals.com';
```

You should see:
```
email                    | role  | full_name  | phone_number   | is_active
-------------------------|-------|------------|----------------|----------
admin@arcarrentals.com  | admin | Admin User | +639123456789  | true
```

## Step 5: Test Login

1. Go to your app at `http://localhost:3001/login`
2. Enter:
   - **Phone**: `+639123456789`
   - **Password**: (the password you set in Step 2)
3. Click **Sign In**
4. You should be redirected to `/admin/dashboard` 🎉

## Troubleshooting

### Error: "column phone_number does not exist"
- You didn't run the updated `migration.sql` yet
- Run it in SQL Editor first
- **Important**: Use the NEW migration.sql that adds phone_number to users table

### Error: "User not found"
- Make sure you created the user in Authentication → Users
- Check the email matches exactly

### Error: "Invalid phone number or password"
- Double-check the phone number format (+639...)
- Make sure you ran the UPDATE queries in Step 3
- Verify password is correct

### Error: "Role is still customer"
- Run the UPDATE queries again
- Check with the verify query in Step 4

## Creating More Admin Users

For any additional admin accounts:

```sql
-- After creating user in Authentication → Users
UPDATE public.user,
    phone_number = '+639987654321',
    full_name = 'Another Admin'
WHERE email = 'another-admin@example.com'
WHERE id = (SELECT id FROM public.users WHERE email = 'another-admin@example.com');
```

## Default Admin Credentials

After setup, you'll have:
- **Phone**: `+639123456789`
- **Email**: `admin@arcarrentals.com`
- **Password**: Whatever you chose in Step 2
- **Role**: admin

**🔒 Important**: Change the password after first login!
