-- First drop the existing policy
DROP POLICY IF EXISTS "Enable all operations for all users" ON widget_settings;

-- Drop and recreate the widget_settings table
DROP TABLE IF EXISTS widget_settings;

-- Create widget_settings table
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
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_client
        FOREIGN KEY(client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;

-- Create new policy
CREATE POLICY "Enable all operations for all users" ON widget_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON widget_settings TO anon;
GRANT ALL ON widget_settings TO authenticated;
GRANT ALL ON widget_settings TO service_role;
