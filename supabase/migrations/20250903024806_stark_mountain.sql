/*
  # Add Numbers font section for numerical displays

  1. New Data
    - Add "Numbers" section to available font sections
    - This will control numerical displays in calculators and price lists

  2. Purpose
    - Dedicated font control for numbers in price lists
    - Dedicated font control for calculator results
    - Better typography control for numerical data
*/

-- Insert the numbers section into available font sections
-- This will be handled by the application logic, no database changes needed for sections
-- The sections are defined in the FontManager component

-- Add a default font preference for numbers section
INSERT INTO font_preferences (section, font_family, font_source, google_fonts_link)
VALUES (
  'numbers',
  'JetBrains Mono',
  'preset',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap'
) ON CONFLICT (section) DO NOTHING;