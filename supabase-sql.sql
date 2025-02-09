-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL, -- In production, use proper password hashing
    company VARCHAR NOT NULL,
    role VARCHAR NOT NULL DEFAULT 'admin',
    clients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON admins
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON admins
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON admins
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON admins
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON admins TO anon;
GRANT ALL ON admins TO authenticated;
GRANT ALL ON admins TO service_role;
