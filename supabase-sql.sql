-- Drop the existing table if it exists
DROP TABLE IF EXISTS global_widget_settings;

-- Create the table with proper structure
CREATE TABLE global_widget_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
ALTER TABLE global_widget_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable all operations for all users" ON global_widget_settings;

-- Create a new policy that allows all operations
CREATE POLICY "Enable all operations for all users"
ON global_widget_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON global_widget_settings TO anon;
GRANT ALL ON global_widget_settings TO authenticated;
GRANT ALL ON global_widget_settings TO service_role;
