# Admin Access Setup Guide

## Step 1: Set Up Database Schema

1. Go to **https://app.supabase.com**
2. Select your **NASMED project**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-schema.sql`
6. Click **Run** (green button)

This creates the `profiles` table and sets up user roles.

## Step 2: Create Admin User

### Option A: Use Existing Member Account

1. In Supabase, go to **Authentication** → **Users**
2. Find your member account (the one you use to login)
3. Copy the **User ID** (UUID) from that user
4. Go back to **SQL Editor** → **New Query**
5. Run this SQL (replace with your actual email):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-member-email@example.com';
```

### Option B: Create New Admin Account

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - Email: `admin@nasmed.org`
   - Password: `TempPassword123!`
4. Click **Create user**
5. Go to **SQL Editor** → **New Query**
6. Run this SQL:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@nasmed.org';
```

## Step 3: Verify Setup

1. In **SQL Editor**, run:
```sql
SELECT email, full_name, role FROM public.profiles WHERE role = 'admin';
```
2. You should see your admin user listed.

## Step 4: Access Admin Page

1. Go to your NASMED website
2. Login with your admin credentials at `/member-login`
3. Navigate to `/admin`
4. You should now see the **Admin Dashboard** with:
   - Applications to review
   - Member management
   - Publications
   - Subscriptions

## Troubleshooting

If you still can't access `/admin`:

1. Visit `/admin` while logged in
2. Look at the **Debug Info** box that appears
3. It will show:
   - Your email
   - Your current role
   - Whether isAdmin is true/false

Share this debug info if you need help!

## Test Credentials

**Demo Admin Credentials:**
- Username: `adamu.ibrahim` (or email)
- Password: `nasmed2024`

**Other Test Members:**
- `folake.adeyemi` / `nasmed2024`
- `chinedu.okafor` / `nasmed2024`
- `amina.bello` / `nasmed2024`

Once you promote one of these to admin, you can login and process applications!