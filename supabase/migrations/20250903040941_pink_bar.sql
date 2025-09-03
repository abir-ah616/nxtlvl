/*
  # Fix RLS policy for available_fonts table

  1. Security Changes
    - Add INSERT policy for authenticated users on available_fonts table
    - Add UPDATE policy for authenticated users on available_fonts table
    - Add DELETE policy for authenticated users on available_fonts table

  This allows authenticated users to manage custom fonts through the admin dashboard.
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Allow authenticated users to insert available fonts"
  ON available_fonts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users  
CREATE POLICY "Allow authenticated users to update available fonts"
  ON available_fonts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for authenticated users
CREATE POLICY "Allow authenticated users to delete available fonts"
  ON available_fonts
  FOR DELETE
  TO authenticated
  USING (true);