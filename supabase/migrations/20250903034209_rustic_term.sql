/*
  # Fix RLS policies for calculation settings

  1. Security Changes
    - Add INSERT policy for authenticated users on `calculation_settings` table
    - Add UPDATE policy for authenticated users on `calculation_settings` table
  
  2. Notes
    - This allows admin dashboard users to save calculation settings
    - Fixes the "new row violates row-level security policy" error
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Allow authenticated users to insert calculation settings"
  ON calculation_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users  
CREATE POLICY "Allow authenticated users to update calculation settings"
  ON calculation_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);