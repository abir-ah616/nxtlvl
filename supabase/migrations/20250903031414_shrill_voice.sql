/*
  # Create social links management system

  1. New Tables
    - `social_links`
      - `id` (uuid, primary key)
      - `platform` (text, unique) - facebook, instagram, discord, whatsapp
      - `url` (text) - the actual link/number
      - `display_name` (text) - optional display name
      - `is_active` (boolean) - whether to show this link
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `social_links` table
    - Add policy for public read access
    - Add policy for service role to manage all operations

  3. Default Data
    - Insert current social media links as default data
*/

CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text UNIQUE NOT NULL,
  url text NOT NULL,
  display_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to social links"
  ON social_links
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to manage social links"
  ON social_links
  FOR ALL
  TO service_role
  USING (true);

-- Insert default social media links
INSERT INTO social_links (platform, url, display_name, is_active) VALUES
  ('discord', 'https://discord.gg/REB74heWQc', 'Discord Server', true),
  ('whatsapp', 'https://wa.me/8801764696964', 'WhatsApp', true),
  ('facebook', 'https://www.facebook.com/mroppy69', 'Facebook', true),
  ('instagram', 'https://www.instagram.com/mroppy21/', 'Instagram', true)
ON CONFLICT (platform) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_social_links_updated_at();