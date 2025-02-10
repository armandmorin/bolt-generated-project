-- Drop existing table if needed
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    role VARCHAR NOT NULL CHECK (role IN ('superadmin', 'admin')),
    company VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all operations for authenticated users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- Insert super admin and admin users
INSERT INTO users (name, email, role, company)
VALUES 
    ('Armand Morin', 'armandmorin@gmail.com', 'superadmin', 'Super Admin Company'),
    ('Bob Davis', 'onebobdavis@gmail.com', 'admin', 'Admin Company')
ON CONFLICT (email) 
DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    updated_at = NOW();
