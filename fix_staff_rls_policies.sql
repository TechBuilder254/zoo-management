-- Fix RLS policies for staff management
-- This script should be run in your Supabase SQL Editor

-- First, let's check if the current user has admin role
-- We need to ensure that admin users can access all users for staff management

-- Update the RLS policy for users table to allow admins to manage all users
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create a more permissive policy for admin users
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text 
        AND role = 'ADMIN'
    )
);

-- Allow admins to insert new users (for staff creation)
CREATE POLICY "Admins can create users" ON users FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text 
        AND role = 'ADMIN'
    )
);

-- Allow admins to update users (for staff management)
CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text 
        AND role = 'ADMIN'
    )
);

-- Allow admins to delete users (for staff removal)
CREATE POLICY "Admins can delete users" ON users FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text 
        AND role = 'ADMIN'
    )
);

-- Also allow staff members to view users (for staff management)
CREATE POLICY "Staff can view users" ON users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text 
        AND (role = 'ADMIN' OR role = 'STAFF')
    )
);

-- Test query to verify the policies work
-- This should return all users if you're logged in as an admin
SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC;


