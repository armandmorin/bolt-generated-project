-- If your clients table does not have a contactEmail column,
-- add it by renaming your existing column if it exists, or add a new one.
-- This command adds a contactEmail column if it doesn't exist.
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
