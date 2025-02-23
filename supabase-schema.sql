-- Safely add unique constraint if it doesn't exist
DO $$
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'unique_client_email'
    ) THEN
        -- Create unique index only if it doesn't exist
        CREATE UNIQUE INDEX unique_client_email ON clients (email);
    END IF;
END $$;

-- Ensure the email column is not nullable
ALTER TABLE clients 
ALTER COLUMN email SET NOT NULL;
