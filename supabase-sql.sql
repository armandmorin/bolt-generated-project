-- First, ensure we have the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing tables if they exist to ensure clean setup
DROP TABLE IF EXISTS public.brand_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.widget_settings CASCADE;

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('superadmin', 'admin')) NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (id)
);

-- Create brand_settings table
CREATE TABLE public.brand_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users NOT NULL,
  logo TEXT,
  primary_color TEXT NOT NULL DEFAULT '#2563eb',
  secondary_color TEXT NOT NULL DEFAULT '#ffffff',
  header_color TEXT NOT NULL DEFAULT '#2563eb',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (admin_id)
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  client_key TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create widget_settings table
CREATE TABLE public.widget_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients NOT NULL,
  header_color TEXT DEFAULT '#60a5fa',
  header_text_color TEXT DEFAULT '#ffffff',
  button_color TEXT DEFAULT '#2563eb',
  powered_by_text TEXT DEFAULT 'Powered by Accessibility Widget',
  powered_by_color TEXT DEFAULT '#64748b',
  button_size TEXT DEFAULT '64px',
  button_position TEXT DEFAULT 'bottom-right',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (client_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_brand_settings_updated_at
  BEFORE UPDATE ON public.brand_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_widget_settings_updated_at
  BEFORE UPDATE ON public.widget_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for brand_settings table
CREATE POLICY "Users can view their own brand settings"
  ON public.brand_settings
  FOR SELECT
  USING (auth.uid() = admin_id);

CREATE POLICY "Users can insert their own brand settings"
  ON public.brand_settings
  FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Users can update their own brand settings"
  ON public.brand_settings
  FOR UPDATE
  USING (auth.uid() = admin_id);

-- Create policies for clients table
CREATE POLICY "Users can view their own clients"
  ON public.clients
  FOR SELECT
  USING (auth.uid() = admin_id);

CREATE POLICY "Users can insert their own clients"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Users can update their own clients"
  ON public.clients
  FOR UPDATE
  USING (auth.uid() = admin_id);

CREATE POLICY "Users can delete their own clients"
  ON public.clients
  FOR DELETE
  USING (auth.uid() = admin_id);

-- Create policies for widget_settings table
CREATE POLICY "Users can view widget settings for their clients"
  ON public.widget_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = widget_settings.client_id
      AND clients.admin_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert widget settings for their clients"
  ON public.widget_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = widget_settings.client_id
      AND clients.admin_id = auth.uid()
    )
  );

CREATE POLICY "Users can update widget settings for their clients"
  ON public.widget_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = widget_settings.client_id
      AND clients.admin_id = auth.uid()
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.brand_settings TO authenticated;
GRANT ALL ON public.clients TO authenticated;
GRANT ALL ON public.widget_settings TO authenticated;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_clients_client_key ON public.clients(client_key);
CREATE INDEX idx_clients_admin_id ON public.clients(admin_id);
CREATE INDEX idx_brand_settings_admin_id ON public.brand_settings(admin_id);
CREATE INDEX idx_widget_settings_client_id ON public.widget_settings(client_id);

-- DO NOT INSERT USERS HERE
-- Users should be created through auth.users first, then inserted here
