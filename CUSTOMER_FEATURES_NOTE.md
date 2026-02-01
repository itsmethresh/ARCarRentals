# Known Issues - Customer Features

## Overview
The following files have TypeScript errors because they reference customer-specific features that are not part of the current admin/staff-only implementation:

### Files with Errors:
1. **RegisterPage.tsx** - Customer registration (line 131)
2. **CustomerDashboardPage.tsx** - Customer dashboard (lines 60, 82, 150, 158)

### Reason:
The new authentication system (`authService.ts`) only supports admin and staff users. The `register()` method and customer-specific user properties (`fullName`, `phoneNumber`) have been removed.

### Resolution Options:

#### Option 1: Disable Customer Features (Recommended for now)
Since you're focusing on admin functionality, you can:
1. Remove or comment out the customer routes in the router
2. Hide customer registration links from the UI
3. Focus on admin/staff features only

#### Option 2: Implement Customer Features Later
When you're ready to add customer portal features:
1. Create a separate customer authentication flow
2. Add customer login using the `customers` table
3. Build customer dashboard with booking history
4. Add customer profile management

### Current Scope:
The current update focuses on:
- ✅ Admin login with email
- ✅ Admin dashboard
- ✅ Booking management with customer records
- ✅ Vehicle management
- ✅ Guest bookings (no login required)

Customer accounts and registration are **not included** in this update.

### Quick Fix (Temporary):
If you want to remove the errors without removing files:

1. In `src/routes/index.tsx`, comment out customer routes:
```typescript
// { path: '/register', element: <RegisterPage /> },
// { path: '/customer-dashboard', element: <CustomerDashboardPage /> },
```

2. Remove registration links from navigation/landing page

This will prevent users from accessing these incomplete features.
