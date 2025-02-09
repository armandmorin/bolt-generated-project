-- Create domain_settings table
CREATE TABLE IF NOT EXISTS public.domain_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_url VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.domain_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for domain_settings table
CREATE POLICY "Enable all operations for all users" ON public.domain_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.domain_settings TO anon;
GRANT ALL ON public.domain_settings TO authenticated;
GRANT ALL ON public.domain_settings TO service_role;

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_domain_settings_updated_at
    BEFORE UPDATE ON public.domain_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
