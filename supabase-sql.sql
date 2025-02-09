-- Drop existing table if needed (be careful with this in production!)
DROP TABLE IF EXISTS users;

-- Create the users table with all required fields
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    company VARCHAR,
    role VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
DROP POLICY IF EXISTS "Enable all operations for all users" ON users;
CREATE POLICY "Enable all operations for all users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- Insert the superadmin user with all required fields
INSERT INTO users (name, email, password, role, company)
VALUES (
    'Armand Morin',
    'armandmorin@gmail.com',
    '1armand',
    'superadmin',
    'Admin Company'
)
ON CONFLICT (email) 
DO UPDATE SET 
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    updated_at = NOW();
