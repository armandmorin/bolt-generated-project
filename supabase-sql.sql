-- Add domain column to brand_settings if it doesn't exist
ALTER TABLE public.brand_settings
ADD COLUMN IF NOT EXISTS widget_domain VARCHAR;
