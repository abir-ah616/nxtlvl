/*
  # Add logo font preference

  1. New Font Preference
    - Add default logo font preference for brand text customization
    - Uses Orbitron as default font for logo/brand text
  
  2. Purpose
    - Allows customization of "NEXT LEVEL - FF" brand text font
    - Separate from navigation and other text elements
*/

-- Add logo font preference
INSERT INTO font_preferences (section, font_family, font_source, google_fonts_link)
VALUES (
  'logo',
  'Orbitron',
  'preset',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap'
)
ON CONFLICT (section) DO UPDATE SET
  font_family = EXCLUDED.font_family,
  font_source = EXCLUDED.font_source,
  google_fonts_link = EXCLUDED.google_fonts_link,
  updated_at = now();