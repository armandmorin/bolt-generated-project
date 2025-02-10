-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing brand_settings table if it exists
DROP TABLE IF EXISTS public.brand_settings CASCADE;

-- Create brand_settings table
CREATE TABLE public.brand_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL,
    logo TEXT,
    primary_color TEXT DEFAULT '#2563eb',
    secondary_color TEXT DEFAULT '#ffffff',
    header_color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(admin_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for brand_settings table
DROP POLICY IF EXISTS "Allow read access" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow insert" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow update own settings" ON public.brand_settings;

CREATE POLICY "Allow read access"
ON public.brand_settings FOR SELECT
USING (true);

CREATE POLICY "Allow insert"
ON public.brand_settings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update own settings"
ON public.brand_settings FOR UPDATE
USING (auth.uid()::text = admin_id::text);

-- Set up storage for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert" ON storage.objects;

CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Allow authenticated insert"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'brand-assets' 
    AND auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON public.brand_settings TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
