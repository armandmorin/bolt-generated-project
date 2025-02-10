-- First, drop all existing policies
DROP POLICY IF EXISTS "brand_settings_select_policy" ON public.brand_settings;
DROP POLICY IF EXISTS "brand_settings_insert_policy" ON public.brand_settings;
DROP POLICY IF EXISTS "brand_settings_update_policy" ON public.brand_settings;
DROP POLICY IF EXISTS "brand_settings_delete_policy" ON public.brand_settings;

-- Disable and re-enable RLS
ALTER TABLE public.brand_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create new policies with explicit auth checks
CREATE POLICY "brand_settings_select_policy" ON public.brand_settings
    FOR SELECT
    USING (
        auth.role() = 'authenticated'
    );

CREATE POLICY "brand_settings_insert_policy" ON public.brand_settings
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid()::text = admin_id::text
    );

CREATE POLICY "brand_settings_update_policy" ON public.brand_settings
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND
        auth.uid()::text = admin_id::text
    );

CREATE POLICY "brand_settings_delete_policy" ON public.brand_settings
    FOR DELETE
    USING (
        auth.role() = 'authenticated' AND
        auth.uid()::text = admin_id::text
    );

-- Grant necessary permissions
GRANT ALL ON public.brand_settings TO authenticated;
