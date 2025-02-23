-- Safely add or modify columns in the existing clients table
DO $$
BEGIN
  -- Add new columns if they don't exist
  BEGIN
    ALTER TABLE public.clients 
    ADD COLUMN IF NOT EXISTS script_key UUID UNIQUE DEFAULT uuid_generate_v4(),
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS contact_person TEXT,
    ADD COLUMN IF NOT EXISTS phone_number TEXT,
    ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#2563eb',
    ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#60a5fa';
  EXCEPTION 
    WHEN OTHERS THEN 
      RAISE NOTICE 'Error adding columns: %', SQLERRM;
  END;

  -- Update existing columns if needed
  BEGIN
    -- First, change the column type
    ALTER TABLE public.clients 
    ALTER COLUMN status TYPE TEXT;

    -- Then, add the check constraint separately
    BEGIN
      ALTER TABLE public.clients 
      ADD CONSTRAINT valid_status 
      CHECK (status IN ('active', 'inactive', 'pending'));
    EXCEPTION 
      WHEN duplicate_object THEN
        RAISE NOTICE 'Check constraint already exists';
    END;

    -- Set default value
    ALTER TABLE public.clients 
    ALTER COLUMN status SET DEFAULT 'pending';
  EXCEPTION 
    WHEN OTHERS THEN 
      RAISE NOTICE 'Error updating columns: %', SQLERRM;
  END;
END $$;

-- Recreate the update timestamp trigger (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger before recreating
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.triggers 
    WHERE event_object_table = 'clients' 
    AND trigger_name = 'update_clients_modtime'
  ) THEN
    DROP TRIGGER update_clients_modtime ON public.clients;
  END IF;
END $$;

-- Recreate the trigger
CREATE TRIGGER update_clients_modtime
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Ensure Row Level Security is enabled
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Clients can be viewed by admins" ON public.clients;
  DROP POLICY IF EXISTS "Admins can insert clients" ON public.clients;
  DROP POLICY IF EXISTS "Admins can update clients" ON public.clients;
END $$;

-- Recreate policies
CREATE POLICY "Clients can be viewed by admins" 
ON public.clients FOR SELECT 
USING (auth.role() = 'admin');

CREATE POLICY "Admins can insert clients" 
ON public.clients FOR INSERT 
WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Admins can update clients" 
ON public.clients FOR UPDATE 
USING (auth.role() = 'admin');
