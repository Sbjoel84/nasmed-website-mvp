# Admin Setup Guide

## Step 1: Deploy the Updated Schema

The `supabase-schema.sql` has been updated to include the `profiles` table and auto-trigger function. If your Supabase database doesn't already have this table, you need to run the schema setup:

1. Go to **https://app.supabase.com**
2. Select your NASMED project
3. Go to **SQL Editor** → **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click **Run**

This will create:
- `profiles` table with `role` column (admin or member)
- Auto-trigger to create profile entries when users sign up
- Row-level security policies
- Indexes for performance

## Step 2: Create or Update Admin User

### Option A: Create a New Admin User (Recommended)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and temporary password (e.g., `admin@nasmed.org` / `TempPassword123!`)
4. Click **Create user**
5. Go to **SQL Editor** and run:

```sql
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@nasmed.org';
```

Then update the password via the app login flow.

### Option B: Promote Existing Member to Admin

If you already have a member account (like `adamu.ibrahim`):

1. Go to **SQL Editor**
2. Run:

```sql
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'your-existing-member@example.com';
```

## Step 3: Test Admin Access

1. Visit your NASMED app
2. Go to `/member-login`
3. Log in with your admin credentials
4. Navigate to `/admin`
5. You should see the **Admin Dashboard** with:
   - Applications overview
   - Members management
   - Publications management
   - Subscriptions tracking

## Troubleshooting

### Admin page still shows "Access Denied"
- **Cause**: Profile role is not set to `admin`
- **Fix**: Run the SQL update above with the correct email

### Can't see the admin route
- **Cause**: Not logged in as admin
- **Fix**: Make sure you're logged in AND your profile role is `admin`

### Login fails with new admin account
- **Cause**: Supabase user might not have auth setup
- **Fix**: Create the user in the Auth section, not SQL directly

## Next Steps

- [ ] Run `supabase-schema.sql` in your Supabase SQL Editor
- [ ] Create or promote an admin user
- [ ] Test `/admin` access
- [ ] Review and manage applications in the admin dashboard
