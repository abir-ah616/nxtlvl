/*
  # Fix RLS policies for admin dashboard tables

  1. Tables Updated
    - `level_fee_rules` - Add authenticated user policies
    - `social_links` - Add authenticated user policies  
    - `currency_rate_settings` - Add authenticated user policies

  2. Security
    - Enable authenticated users to INSERT/UPDATE on all admin tables
    - Maintain existing public read access
    - Keep service role full access

  3. Changes
    - Add INSERT and UPDATE policies for authenticated users on level_fee_rules
    - Add INSERT and UPDATE policies for authenticated users on social_links
    - Add INSERT and UPDATE policies for authenticated users on currency_rate_settings
*/

-- Fix level_fee_rules RLS policies
CREATE POLICY "Allow authenticated users to insert level fee rules"
  ON level_fee_rules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update level fee rules"
  ON level_fee_rules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix social_links RLS policies  
CREATE POLICY "Allow authenticated users to insert social links"
  ON social_links
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update social links"
  ON social_links
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix currency_rate_settings RLS policies
CREATE POLICY "Allow authenticated users to insert currency rate settings"
  ON currency_rate_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update currency rate settings"
  ON currency_rate_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);