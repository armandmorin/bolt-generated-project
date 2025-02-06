-- First, add any missing columns to the clients table
ALTER TABLE clients 
  ADD COLUMN IF NOT EXISTS website VARCHAR,
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR,
  ADD COLUMN IF NOT EXISTS client_key VARCHAR,
  ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add unique constraint for client_key (wrapped in DO block to handle if exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'clients_client_key_key'
  ) THEN
    ALTER TABLE clients ADD CONSTRAINT clients_client_key_key UNIQUE (client_key);
  END IF;
END$$;

-- Create widget_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS widget_settings (
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

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;

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

-- Grant permissions
GRANT ALL ON clients TO anon;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON clients TO service_role;

GRANT ALL ON widget_settings TO anon;
GRANT ALL ON widget_settings TO authenticated;
GRANT ALL ON widget_settings TO service_role;

-- Create indexes (wrapped in DO blocks to handle if exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_client_key'
  ) THEN
    CREATE INDEX idx_clients_client_key ON clients(client_key);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_widget_settings_client_id'
  ) THEN
    CREATE INDEX idx_widget_settings_client_id ON widget_settings(client_id);
  END IF;
END$$;

-- Refresh the schema cache
SELECT schema_cache_reload();
