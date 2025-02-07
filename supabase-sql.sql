-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    website VARCHAR NOT NULL,
    contact_email VARCHAR NOT NULL,
    client_key VARCHAR NOT NULL UNIQUE,
    status VARCHAR NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policy for clients table
CREATE POLICY "Enable all operations for all users" ON clients
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON clients TO anon;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON clients TO service_role;
