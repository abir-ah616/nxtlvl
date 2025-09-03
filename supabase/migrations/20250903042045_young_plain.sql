/*
  # Add default fonts to available_fonts table

  1. New Data
    - Insert default Google Fonts including Oxanium, Outfit, Fira Code, Space Grotesk
    - Each font includes proper Google Fonts links with multiple weights
    - Categorized as 'modern', 'monospace', or 'display' fonts
  
  2. Font Links
    - All links include multiple font weights for better typography
    - Links are properly formatted for Google Fonts API v2
    - Include display=swap for better loading performance
*/

-- Insert default fonts with proper Google Fonts links
INSERT INTO available_fonts (name, font_family, google_fonts_link, category, is_active) VALUES
  ('Inter', 'Inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Poppins', 'Poppins', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Roboto', 'Roboto', 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap', 'modern', true),
  ('Open Sans', 'Open Sans', 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Lato', 'Lato', 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap', 'modern', true),
  ('Montserrat', 'Montserrat', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Nunito', 'Nunito', 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Source Sans Pro', 'Source Sans Pro', 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap', 'modern', true),
  ('Ubuntu', 'Ubuntu', 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap', 'modern', true),
  ('Raleway', 'Raleway', 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Playfair Display', 'Playfair Display', 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap', 'display', true),
  ('Merriweather', 'Merriweather', 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap', 'display', true),
  ('Oswald', 'Oswald', 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap', 'display', true),
  ('Orbitron', 'Orbitron', 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap', 'display', true),
  ('Exo', 'Exo', 'https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Rajdhani', 'Rajdhani', 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('JetBrains Mono', 'JetBrains Mono', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap', 'monospace', true),
  ('Fira Code', 'Fira Code', 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap', 'monospace', true),
  ('Source Code Pro', 'Source Code Pro', 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&display=swap', 'monospace', true),
  ('Space Mono', 'Space Mono', 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap', 'monospace', true),
  ('Oxanium', 'Oxanium', 'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700&display=swap', 'display', true),
  ('Outfit', 'Outfit', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap', 'modern', true),
  ('Space Grotesk', 'Space Grotesk', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap', 'modern', true)
ON CONFLICT (name) DO UPDATE SET
  font_family = EXCLUDED.font_family,
  google_fonts_link = EXCLUDED.google_fonts_link,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active;