-- Enable storage if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a storage bucket for brand assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow public access to the bucket
CREATE POLICY "Give public access to brand-assets" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'brand-assets');

-- Create a policy to allow authenticated users to upload to the bucket
CREATE POLICY "Allow authenticated uploads to brand-assets" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'brand-assets');

-- Create a policy to allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates to brand-assets" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'brand-assets');
