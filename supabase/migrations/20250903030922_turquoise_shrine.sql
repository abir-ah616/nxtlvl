/*
  # Create calculation settings and level fee rules tables

  1. New Tables
    - `calculation_settings`
      - `id` (uuid, primary key)
      - `setting_name` (text, unique)
      - `setting_value` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `level_fee_rules`
      - `id` (uuid, primary key)
      - `from_level` (integer)
      - `to_level` (integer)
      - `additional_fee_usd` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access and service role management

  3. Initial Data
    - Insert default EXP rate (9000) and base cost (0.2083)
    - Insert all level fee rules as specified
*/

-- Create calculation_settings table
CREATE TABLE IF NOT EXISTS calculation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name text UNIQUE NOT NULL,
  setting_value numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create level_fee_rules table
CREATE TABLE IF NOT EXISTS level_fee_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_level integer NOT NULL,
  to_level integer NOT NULL,
  additional_fee_usd numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE calculation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_fee_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for calculation_settings
CREATE POLICY "Allow public read access to calculation settings"
  ON calculation_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to manage calculation settings"
  ON calculation_settings
  FOR ALL
  TO service_role
  USING (true);

-- Create policies for level_fee_rules
CREATE POLICY "Allow public read access to level fee rules"
  ON level_fee_rules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to manage level fee rules"
  ON level_fee_rules
  FOR ALL
  TO service_role
  USING (true);

-- Insert default calculation settings
INSERT INTO calculation_settings (setting_name, setting_value) VALUES
  ('exp_per_hour', 9000),
  ('base_cost_per_hour', 0.2083)
ON CONFLICT (setting_name) DO NOTHING;

-- Insert level fee rules
INSERT INTO level_fee_rules (from_level, to_level, additional_fee_usd) VALUES
  (50, 60, 1.0),
  (61, 70, 2.0),
  (71, 75, 2.5),
  (76, 80, 3.0),
  (81, 90, 8.0),
  (91, 95, 12.0),
  (96, 100, 15.0)
ON CONFLICT DO NOTHING;

-- Create update trigger for calculation_settings
CREATE OR REPLACE FUNCTION update_calculation_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calculation_settings_updated_at
  BEFORE UPDATE ON calculation_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_calculation_settings_updated_at();

-- Create update trigger for level_fee_rules
CREATE OR REPLACE FUNCTION update_level_fee_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_fee_rules_updated_at
  BEFORE UPDATE ON level_fee_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_level_fee_rules_updated_at();