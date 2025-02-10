import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.pgrst.object+json'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to get brand settings with proper error handling
export const getBrandSettings = async (adminId) => {
  try {
    // First, check if brand settings exist
    const { data: existingSettings, error: settingsError } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('admin_id', adminId);

    // If no settings exist, return default settings
    if (settingsError || !existingSettings || existingSettings.length === 0) {
      console.warn('No brand settings found, returning default');
      return {
        logo: '',
        primary_color: '#2563eb',
        secondary_color: '#ffffff',
        header_color: '#2563eb',
        admin_id: adminId
      };
    }

    // Return the first (and should be only) settings record
    return existingSettings[0];
  } catch (error) {
    console.error('Unexpected error in getBrandSettings:', error);
    
    // Return default settings in case of any error
    return {
      logo: '',
      primary_color: '#2563eb',
      secondary_color: '#ffffff',
      header_color: '#2563eb',
      admin_id: adminId
    };
  }
};

export const createDefaultBrandSettings = async (adminId) => {
  try {
    const defaultSettings = {
      admin_id: adminId,
      logo: '',
      primary_color: '#2563eb',
      secondary_color: '#ffffff',
      header_color: '#2563eb',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('brand_settings')
      .upsert(defaultSettings, { 
        onConflict: 'admin_id' 
      })
      .select();

    if (error) {
      console.error('Error creating default brand settings:', error);
      return defaultSettings;
    }

    return data[0] || defaultSettings;
  } catch (error) {
    console.error('Unexpected error creating default brand settings:', error);
    return {
      admin_id: adminId,
      logo: '',
      primary_color: '#2563eb',
      secondary_color: '#ffffff',
      header_color: '#2563eb'
    };
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
