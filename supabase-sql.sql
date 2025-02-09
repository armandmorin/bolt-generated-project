-- Add admin_id column if it doesn't exist
ALTER TABLE brand_settings
ADD COLUMN IF NOT EXISTS admin_id UUID;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'brand_settings_admin_id_fkey'
    ) THEN
        ALTER TABLE brand_settings
        ADD CONSTRAINT brand_settings_admin_id_fkey
        FOREIGN KEY (admin_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for all users" ON brand_settings;

-- Create new policies
CREATE POLICY "Users can view own brand settings"
ON brand_settings FOR SELECT
USING (auth.uid() = admin_id);

CREATE POLICY "Users can update own brand settings"
ON brand_settings FOR UPDATE
USING (auth.uid() = admin_id);

CREATE POLICY "Users can insert own brand settings"
ON brand_settings FOR INSERT
WITH CHECK (auth.uid() = admin_id);

-- Make sure RLS is enabled
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Add unique constraint on admin_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'brand_settings_admin_id_key'
    ) THEN
        ALTER TABLE brand_settings
        ADD CONSTRAINT brand_settings_admin_id_key
        UNIQUE (admin_id);
    END IF;
END
$$;
