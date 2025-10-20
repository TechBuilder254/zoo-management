-- =====================================================
-- FIX USER SYNC BETWEEN SUPABASE AUTH AND CUSTOM USERS TABLE
-- =====================================================
-- This script creates a trigger to automatically sync users
-- from Supabase Auth (auth.users) to the custom users table
-- =====================================================

-- First, let's create a function to handle user creation/updates
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user in custom users table
  INSERT INTO users (
    id,
    email,
    password, -- We'll use a placeholder since Supabase handles auth
    name,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    'supabase_auth_user', -- Placeholder password since Supabase handles auth
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), -- Use name from metadata or email
    COALESCE(NEW.raw_user_meta_data->>'role', 'VISITOR')::"Role", -- Use role from metadata or default to VISITOR
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- UPDATE EXISTING USERS
-- =====================================================
-- Sync any existing auth users to the custom users table
INSERT INTO users (
  id,
  email,
  password,
  name,
  role,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  'supabase_auth_user',
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  COALESCE(au.raw_user_meta_data->>'role', 'VISITOR')::"Role",
  au.created_at,
  au.updated_at
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- UPDATE RLS POLICIES
-- =====================================================
-- Update RLS policies to work with Supabase Auth
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- New policies that work with Supabase Auth
CREATE POLICY "Users can view own profile" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ User sync setup completed successfully!';
  RAISE NOTICE '🔄 Users from Supabase Auth will now be automatically synced to the custom users table.';
  RAISE NOTICE '🔒 RLS policies have been updated to work with Supabase Auth.';
  RAISE NOTICE '💡 The foreign key constraint error should now be resolved.';
END $$;
