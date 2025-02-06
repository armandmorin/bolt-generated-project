-- First, check and update the clients table structure
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_email VARCHAR;

-- Make sure we have all the correct columns in clients table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'clients'
    ) THEN
        CREATE TABLE clients (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR NOT NULL,
            website VARCHAR NOT NULL,
            contact_email VARCHAR,
            client_key VARCHAR NOT NULL UNIQUE,
            status VARCHAR NOT NULL DEFAULT 'active',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Create widget_settings table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'widget_settings'
    ) THEN
        CREATE TABLE widget_settings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            client_id UUID REFERENCES clients(id),
            header_color VARCHAR,
            header_text_color VARCHAR,
            button_color VARCHAR,
            powered_by_text VARCHAR,
            powered_by_color VARCHAR,
            button_size VARCHAR,
            button_position VARCHAR,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Enable RLS (this is idempotent, so no need to check)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable all operations for all users" ON clients;
    DROP POLICY IF EXISTS "Enable all operations for all users" ON widget_settings;
    
    -- Create new policies
    CREATE POLICY "Enable all operations for all users" ON clients
        FOR ALL
        USING (true)
        WITH CHECK (true);

    CREATE POLICY "Enable all operations for all users" ON widget_settings
        FOR ALL
        USING (true)
        WITH CHECK (true);
END $$;

-- Grant permissions (these are idempotent)
GRANT ALL ON clients TO anon;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON clients TO service_role;

GRANT ALL ON widget_settings TO anon;
GRANT ALL ON widget_settings TO authenticated;
GRANT ALL ON widget_settings TO service_role;
