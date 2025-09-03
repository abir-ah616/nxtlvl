/*
  # Fix font data and Google Fonts links

  1. Font Updates
    - Update Oxanium font with correct Google Fonts link
    - Update Outfit font with correct Google Fonts link  
    - Update Fira Code font with correct Google Fonts link
    - Update Space Grotesk font with correct Google Fonts link
    - Update Joti One font with correct Google Fonts link
    - Ensure all font family names match Google Fonts exactly

  2. Font Links
    - All Google Fonts links include proper weight ranges
    - Links use display=swap for better performance
    - Font family names are extracted correctly from links
*/

-- Update existing fonts with correct Google Fonts links
UPDATE available_fonts 
SET 
  font_family = 'Oxanium',
  google_fonts_link = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@200;300;400;500;600;700;800&display=swap'
WHERE name = 'Oxanium';

UPDATE available_fonts 
SET 
  font_family = 'Outfit',
  google_fonts_link = 'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap'
WHERE name = 'Outfit';

UPDATE available_fonts 
SET 
  font_family = 'Fira Code',
  google_fonts_link = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap'
WHERE name = 'Fira Code';

UPDATE available_fonts 
SET 
  font_family = 'Space Grotesk',
  google_fonts_link = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
WHERE name = 'Space Grotesk';

UPDATE available_fonts 
SET 
  font_family = 'Joti One',
  google_fonts_link = 'https://fonts.googleapis.com/css2?family=Joti+One&display=swap'
WHERE name = 'Joti One';

-- Insert any missing fonts
INSERT INTO available_fonts (name, font_family, google_fonts_link, category, is_active)
VALUES 
  ('Oxanium', 'Oxanium', 'https://fonts.googleapis.com/css2?family=Oxanium:wght@200;300;400;500;600;700;800&display=swap', 'modern', true),
  ('Outfit', 'Outfit', 'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap', 'modern', true),
  ('Fira Code', 'Fira Code', 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap', 'monospace', true),
  ('Space Grotesk', 'Space Grotesk', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Joti One', 'Joti One', 'https://fonts.googleapis.com/css2?family=Joti+One&display=swap', 'decorative', true)
ON CONFLICT (name) DO UPDATE SET
  font_family = EXCLUDED.font_family,
  google_fonts_link = EXCLUDED.google_fonts_link,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active;