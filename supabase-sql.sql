-- First, drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow read access" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow insert" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow update own settings" ON public.brand_settings;

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE public.brand_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for testing
CREATE POLICY "brand_settings_select_policy"
ON public.brand_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "brand_settings_insert_policy"
ON public.brand_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "brand_settings_update_policy"
ON public.brand_settings FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "brand_settings_delete_policy"
ON public.brand_settings FOR DELETE
TO authenticated
USING (true);

-- Grant full access to authenticated users
GRANT ALL ON public.brand_settings TO authenticated;
