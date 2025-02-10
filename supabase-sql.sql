-- Ensure unique constraint on admin_id in brand_settings
ALTER TABLE public.brand_settings 
ADD CONSTRAINT unique_admin_id UNIQUE (admin_id);

-- Recreate the table with proper constraints if needed
CREATE TABLE IF NOT EXISTS public.brand_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    logo TEXT,
    primary_color TEXT DEFAULT '#2563eb',
    secondary_color TEXT DEFAULT '#ffffff',
    header_color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own brand settings" 
ON public.brand_settings 
FOR ALL 
USING (auth.uid() = admin_id);
