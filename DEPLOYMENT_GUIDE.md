# Zoo Management System - Deployment Guide

## Quick Fix for Review Creation Error

### Issue
Users are getting a foreign key constraint error when trying to create reviews:
```
ERROR: insert or update on table "reviews" violates foreign key constraint "reviews_user_id_fkey"
```

### Root Cause
The application uses Supabase Auth (which stores users in `auth.users`), but the database schema has a separate custom `users` table. When users register through Supabase Auth, they get an ID in the `auth.users` table, but there's no corresponding record in the custom `users` table that the foreign key constraint references.

### Solution
Run the following SQL script in your Supabase SQL Editor to fix the issue:

1. **Open your Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the contents of `fix_user_sync.sql`**
4. **Execute the script**

This script will:
- Create a trigger that automatically syncs users from Supabase Auth to the custom users table
- Update existing auth users to the custom users table
- Update RLS policies to work properly with Supabase Auth

### Alternative Quick Fix (if you prefer not to use triggers)
If you don't want to use triggers, you can modify the review creation to use the auth user ID directly by updating the foreign key constraint:

```sql
-- Drop the existing foreign key constraint
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Add a new foreign key constraint that references auth.users
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

However, the trigger approach is recommended as it maintains data consistency.

## Full Deployment Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd zoo
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Database Setup
1. **Create a new Supabase project**
2. **Run the main setup script:**
   - Copy the contents of `SUPABASE_SETUP.sql`
   - Paste into Supabase SQL Editor
   - Execute the script

3. **Fix the user sync issue:**
   - Copy the contents of `fix_user_sync.sql`
   - Paste into Supabase SQL Editor
   - Execute the script

### 4. Frontend Setup
```bash
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 5. Start the Application
```bash
# Start the backend (from root directory)
npm run dev

# Start the frontend (from frontend directory)
cd frontend
npm start
```

### 6. Create Admin User
```bash
# Run the admin creation script
node create-admin-user.js
```

### 7. Test the Application
1. **Register a new user**
2. **Try to create a review** - this should now work without the foreign key error
3. **Check the admin dashboard** for user management

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Error**
   - Run the `fix_user_sync.sql` script
   - This creates a trigger to sync auth users with the custom users table

2. **RLS Policy Errors**
   - The fix script also updates RLS policies to work with Supabase Auth
   - Make sure you're logged in when testing

3. **CORS Issues**
   - Add your frontend URL to Supabase CORS settings
   - Go to Settings > API > CORS in your Supabase dashboard

4. **Authentication Issues**
   - Check that your Supabase credentials are correct
   - Verify that email confirmation is set up properly

### Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] Review creation works (no foreign key error)
- [ ] Admin dashboard accessible
- [ ] Animal data displays correctly
- [ ] Booking system works

## Production Deployment

### Frontend (Vercel/Netlify)
1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to your preferred platform**
3. **Update CORS settings in Supabase**

### Backend (Railway/Heroku)
1. **Set environment variables**
2. **Deploy the backend**
3. **Run database migrations**

## Support
If you encounter issues:
1. Check the console for error messages
2. Verify your Supabase credentials
3. Ensure all database scripts have been run
4. Check that RLS policies are correctly configured