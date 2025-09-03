/*
  # Fix RLS policy for reviews table

  1. Security Updates
    - Add policy for authenticated users to insert reviews
    - Add policy for authenticated users to update reviews  
    - Add policy for authenticated users to delete reviews
    - Keep existing public read access policy

  This allows admin users to manage reviews through the admin dashboard while maintaining public read access for the main website.
*/

-- Add policy for authenticated users to insert reviews
CREATE POLICY "Allow authenticated users to insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add policy for authenticated users to update reviews
CREATE POLICY "Allow authenticated users to update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add policy for authenticated users to delete reviews
CREATE POLICY "Allow authenticated users to delete reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (true);