import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create a stored procedure to create the global settings table
export async function createStoredProcedure() {
  const { error } = await supabase.rpc('create_function_if_not_exists', {
    function_name: 'create_global_settings_table',
    function_body: `
      BEGIN
        CREATE TABLE IF NOT EXISTS global_widget_settings (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          header_color TEXT DEFAULT '#60a5fa',
          header_text_color TEXT DEFAULT '#1e293b',
          button_color TEXT DEFAULT '#2563eb',
          powered_by_text TEXT DEFAULT 'Powered by Accessibility Widget',
          powered_by_color TEXT DEFAULT '#64748b',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
        
        -- Enable RLS
        ALTER TABLE global_widget_settings ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DROP POLICY IF EXISTS "Allow anonymous read access" ON global_widget_settings;
        CREATE POLICY "Allow anonymous read access"
          ON global_widget_settings FOR SELECT
          TO anon
          USING (true);
        
        DROP POLICY IF EXISTS "Allow authenticated full access" ON global_widget_settings;
        CREATE POLICY "Allow authenticated full access"
          ON global_widget_settings FOR ALL
          TO authenticated
          USING (true)
          WITH CHECK (true);
          
        RETURN true;
      END;
    `
  });

  if (error) {
    console.error('Error creating stored procedure:', error);
  }
}

// Call this when initializing your app
createStoredProcedure().catch(console.error);
