-- Create brand_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.brand_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logo TEXT,
    header_color VARCHAR NOT NULL DEFAULT '#2563eb',
    primary_color VARCHAR NOT NULL DEFAULT '#2563eb',
    button_color VARCHAR NOT NULL DEFAULT '#2563eb',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for brand_settings table
CREATE POLICY "Enable all operations for all users" ON public.brand_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.brand_settings TO anon;
GRANT ALL ON public.brand_settings TO authenticated;
GRANT ALL ON public.brand_settings TO service_role;

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_brand_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brand_settings_updated_at
    BEFORE UPDATE ON public.brand_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_brand_settings_updated_at();

-- Insert default settings if none exist
INSERT INTO public.brand_settings (header_color, primary_color, button_color)
SELECT '#2563eb', '#2563eb', '#2563eb'
WHERE NOT EXISTS (SELECT 1 FROM public.brand_settings);
