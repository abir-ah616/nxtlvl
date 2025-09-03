/*
  # Admin Authentication Setup

  1. Authentication
    - Uses Supabase's built-in auth system
    - Email/password authentication only
    - No email confirmation required for admin access

  2. Security
    - Admin access controlled through authentication
    - Only authenticated users can access admin dashboard
    - Reviews table policies allow authenticated users to manage data

  3. Notes
    - Create admin user manually in Supabase dashboard
    - Or use Supabase auth signup in the application
*/

-- Enable email signup without confirmation for admin accounts
-- This is handled in Supabase dashboard settings

-- Reviews table already has proper RLS policies for authenticated users
-- No additional setup needed for admin authentication