-- Create widget_settings table
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
ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for widget_settings table
CREATE POLICY "Enable all operations for all users" ON widget_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON widget_settings TO anon;
GRANT ALL ON widget_settings TO authenticated;
GRANT ALL ON widget_settings TO service_role;
