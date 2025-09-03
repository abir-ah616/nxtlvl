/*
  # Font Preferences Management System

  1. New Tables
    - `font_preferences`
      - `id` (uuid, primary key)
      - `section` (text, unique) - section identifier (hero, navigation, body, etc.)
      - `font_family` (text) - the font family name
      - `font_source` (text) - 'preset' or 'custom'
      - `google_fonts_link` (text, optional) - Google Fonts embed link for custom fonts
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `available_fonts`
      - `id` (uuid, primary key)
      - `name` (text, unique) - display name
      - `font_family` (text) - CSS font-family value
      - `google_fonts_link` (text) - Google Fonts embed link
      - `category` (text) - font category (futuristic, modern, etc.)
      - `is_active` (boolean) - whether font is available for selection
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access and service role management

  3. Default Data
    - Insert 10 carefully selected fonts
    - Set default font preferences for different sections
*/

-- Create available_fonts table
CREATE TABLE IF NOT EXISTS available_fonts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  font_family text NOT NULL,
  google_fonts_link text NOT NULL,
  category text NOT NULL DEFAULT 'modern',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create font_preferences table
CREATE TABLE IF NOT EXISTS font_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  font_family text NOT NULL,
  font_source text NOT NULL DEFAULT 'preset',
  google_fonts_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE available_fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE font_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for available_fonts
CREATE POLICY "Allow public read access to available fonts"
  ON available_fonts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to manage available fonts"
  ON available_fonts
  FOR ALL
  TO service_role
  USING (true);

-- Create policies for font_preferences
CREATE POLICY "Allow public read access to font preferences"
  ON font_preferences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role to manage font preferences"
  ON font_preferences
  FOR ALL
  TO service_role
  USING (true);

-- Insert 10 carefully selected fonts
INSERT INTO available_fonts (name, font_family, google_fonts_link, category) VALUES
  ('Orbitron', 'Orbitron', 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap', 'futuristic'),
  ('Exo', 'Exo', 'https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&display=swap', 'futuristic'),
  ('Oxanium', 'Oxanium', 'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700&display=swap', 'futuristic'),
  ('Rajdhani', 'Rajdhani', 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap', 'modern'),
  ('Inter', 'Inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', 'modern'),
  ('Poppins', 'Poppins', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', 'modern'),
  ('Outfit', 'Outfit', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap', 'modern'),
  ('Space Grotesk', 'Space Grotesk', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap', 'tech'),
  ('JetBrains Mono', 'JetBrains Mono', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap', 'monospace'),
  ('Fira Code', 'Fira Code', 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap', 'monospace');

-- Set default font preferences for different sections
INSERT INTO font_preferences (section, font_family, font_source, google_fonts_link) VALUES
  ('hero', 'Orbitron', 'preset', 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'),
  ('navigation', 'Inter', 'preset', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'),
  ('headings', 'Exo', 'preset', 'https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&display=swap'),
  ('body', 'Inter', 'preset', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'),
  ('buttons', 'Rajdhani', 'preset', 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap'),
  ('cards', 'Poppins', 'preset', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_font_preferences_updated_at
    BEFORE UPDATE ON font_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();