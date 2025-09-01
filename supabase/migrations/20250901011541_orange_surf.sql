/*
  # Create currency rates cache table

  1. New Tables
    - `currency_rates`
      - `id` (uuid, primary key)
      - `from_currency` (text, e.g., 'USD')
      - `to_currency` (text, e.g., 'BDT')
      - `rate` (numeric, exchange rate value)
      - `updated_at` (timestamp, when rate was last updated)
      - `created_at` (timestamp, when record was created)

  2. Security
    - Enable RLS on `currency_rates` table
    - Add policy for public read access (rates are public data)
    - Add policy for service role to insert/update rates

  3. Indexes
    - Unique constraint on from_currency + to_currency combination
    - Index on updated_at for efficient cache lookups
*/

CREATE TABLE IF NOT EXISTS currency_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate numeric NOT NULL,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Enable RLS
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to currency rates (they are public data)
CREATE POLICY "Anyone can read currency rates"
  ON currency_rates
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to insert/update rates
CREATE POLICY "Service role can manage currency rates"
  ON currency_rates
  FOR ALL
  TO service_role
  USING (true);

-- Create index for efficient cache lookups
CREATE INDEX IF NOT EXISTS idx_currency_rates_updated_at 
  ON currency_rates (updated_at DESC);

-- Create index for currency pair lookups
CREATE INDEX IF NOT EXISTS idx_currency_rates_pair 
  ON currency_rates (from_currency, to_currency);