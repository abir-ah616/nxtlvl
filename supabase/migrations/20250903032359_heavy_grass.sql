/*
  # Currency Rate Settings Management

  1. New Tables
    - `currency_rate_settings`
      - `id` (uuid, primary key)
      - `rate_source` (text) - 'api' or 'custom'
      - `custom_rate` (numeric) - custom USD to BDT rate
      - `is_active` (boolean) - whether this setting is active
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `currency_rate_settings` table
    - Add policy for public read access
    - Add policy for service role management

  3. Initial Data
    - Insert default setting with API rate source
*/

-- Create currency rate settings table
CREATE TABLE IF NOT EXISTS currency_rate_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_source text NOT NULL DEFAULT 'api' CHECK (rate_source IN ('api', 'custom')),
  custom_rate numeric DEFAULT 120.0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE currency_rate_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to currency rate settings"
  ON currency_rate_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to manage currency rate settings"
  ON currency_rate_settings
  FOR ALL
  TO service_role
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_currency_rate_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_currency_rate_settings_updated_at
  BEFORE UPDATE ON currency_rate_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_currency_rate_settings_updated_at();

-- Insert default setting
INSERT INTO currency_rate_settings (rate_source, custom_rate, is_active)
VALUES ('api', 120.0, true)
ON CONFLICT DO NOTHING;