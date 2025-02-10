-- Drop existing policies for brand_settings
DROP POLICY IF EXISTS "Allow read access" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow insert" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow update own settings" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.brand_settings;

-- Create new comprehensive policies for brand_settings
CREATE POLICY "Enable read access for all users"
ON public.brand_settings FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.brand_settings FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
ON public.brand_settings FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
ON public.brand_settings FOR DELETE
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.brand_settings TO authenticated;
GRANT ALL ON public.brand_settings TO anon;

-- Verify RLS is enabled
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
