# Admin User Creation Guide

## Step 1: Check Existing Users

Run this in Supabase SQL Editor:
```sql
-- Check what users exist
SELECT id, email, created_at FROM auth.users;

-- Check profiles
SELECT id, email, full_name, role FROM public.profiles;
```

## Step 2: Create Admin User in Supabase

### Option A: Create via Supabase Dashboard (Recommended)

1. Go to **https://app.supabase.com** → Your NASMED project
2. Click **Authentication** in the left sidebar
3. Click **Users** tab
4. Click **Add user** button
5. Enter:
   - **Email**: `joelyahaya7@gmail.com`
   - **Password**: `nasmed2024` (or whatever you want)
   - **Auto-confirm user**: ✅ Checked
6. Click **Create user**

### Option B: Create via Signup Form

1. Go to your website: `http://localhost:5173` (or your deployed URL)
2. Click **Member Login**
3. Click **Sign Up** link
4. Create account with:
   - Email: `joelyahaya7@gmail.com`
   - Password: `nasmed2024`
   - Full Name: Your name
   - Membership Type: Professional Member

## Step 3: Promote to Admin

After the user account exists, run this in SQL Editor:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'joelyahaya7@gmail.com';
```

## Step 4: Verify Admin Access

Run this to confirm:
```sql
SELECT email, full_name, role FROM public.profiles
WHERE email = 'joelyahaya7@gmail.com';
```

You should see `role = admin`.

## Step 5: Login and Access Admin

1. Go to `/member-login`
2. Login with:
   - Email: `joelyahaya7@gmail.com`
   - Password: `nasmed2024` (or whatever you set)
3. Navigate to `/admin`
4. You should see the admin dashboard!

## Troubleshooting

### "Invalid login credentials"
- **Cause**: User account doesn't exist
- **Fix**: Create the user account first (Step 2 above)

### "Access Denied" on /admin
- **Cause**: User exists but role is not 'admin'
- **Fix**: Run the UPDATE query in Step 3

### Can't see admin dashboard
- **Cause**: Profiles table not set up
- **Fix**: Run the schema setup first

## Test Credentials

Once set up, use:
- **Email**: `joelyahaya7@gmail.com`
- **Password**: `nasmed2024`

The issue is that the user account needs to exist in Supabase Auth before you can promote it to admin. Create the account first, then promote it!