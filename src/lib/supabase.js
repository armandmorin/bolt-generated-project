import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});

// Helper function to get brand settings with proper error handling
export const getBrandSettings = async (adminId) => {
  try {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('admin_id', adminId)
      .single();

    if (error) {
      console.error('Error fetching brand settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getBrandSettings:', error);
    return null;
  }
};

export const initializeTables = async () => {
  try {
    const { error: brandSettingsError } = await supabase.rpc('create_brand_settings_if_not_exists');
    
    if (brandSettingsError) {
      console.error('Error creating brand_settings table:', brandSettingsError);
    }
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

export default supabase;
