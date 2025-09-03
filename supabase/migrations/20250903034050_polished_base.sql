/*
  # Fix RLS policies for font preferences

  1. Security Updates
    - Add INSERT policy for authenticated users on font_preferences table
    - Add UPDATE policy for authenticated users on font_preferences table
    - Ensure authenticated users can manage font preferences from admin dashboard

  2. Changes
    - Allow authenticated users to insert new font preferences
    - Allow authenticated users to update existing font preferences
    - Maintain existing SELECT policy for public access
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Allow authenticated users to insert font preferences"
  ON font_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users  
CREATE POLICY "Allow authenticated users to update font preferences"
  ON font_preferences
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);