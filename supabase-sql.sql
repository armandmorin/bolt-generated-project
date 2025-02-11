-- Create admin_branding table with proper constraints
CREATE TABLE IF NOT EXISTS admin_branding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT UNIQUE NOT NULL,
    logo TEXT,
    primary_color TEXT DEFAULT '#2563eb',
    secondary_color TEXT DEFAULT '#ffffff',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure unique constraint on admin_email
CREATE UNIQUE INDEX IF NOT EXISTS unique_admin_email ON admin_branding(admin_email);

-- Enable Row Level Security
ALTER TABLE admin_branding ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if any
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON admin_branding;

-- Create policy to allow operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON admin_branding
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions on the table
GRANT ALL ON admin_branding TO anon, authenticated, service_role;
