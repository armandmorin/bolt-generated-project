import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to initialize tables
export const initializeTables = async () => {
  try {
    // Create brand_settings table if it doesn't exist
    const { error: brandSettingsError } = await supabase.rpc('create_brand_settings_if_not_exists');
    
    if (brandSettingsError) {
      console.error('Error creating brand_settings table:', brandSettingsError);
    }
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

export default supabase;
