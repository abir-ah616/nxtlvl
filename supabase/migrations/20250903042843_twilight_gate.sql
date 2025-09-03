/*
  # Update default fonts with proper Google Fonts links

  1. Font Updates
    - Update existing fonts with corrected Google Fonts links
    - Add missing fonts with proper links
    - Ensure all fonts have working Google Fonts URLs

  2. Font Links
    - Oxanium: Updated with proper weights
    - Outfit: Added with multiple weights
    - Fira Code: Updated with proper weights
    - Space Grotesk: Added with proper weights
    - Joti One: Added with proper link
*/

-- Update existing fonts with proper Google Fonts links
UPDATE available_fonts 
SET google_fonts_link = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@200;300;400;500;600;700;800&display=swap'
WHERE name = 'Oxanium';

UPDATE available_fonts 
SET google_fonts_link = 'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap'
WHERE name = 'Outfit';

UPDATE available_fonts 
SET google_fonts_link = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap'
WHERE name = 'Fira Code';

-- Insert missing fonts if they don't exist
INSERT INTO available_fonts (name, font_family, google_fonts_link, category, is_active)
VALUES 
  ('Space Grotesk', 'Space Grotesk', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Joti One', 'Joti One', 'https://fonts.googleapis.com/css2?family=Joti+One&display=swap', 'decorative', true)
ON CONFLICT (name) DO UPDATE SET
  google_fonts_link = EXCLUDED.google_fonts_link,
  font_family = EXCLUDED.font_family;