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
      'Accept': 'application/json'
    }
  },
  db: {
    schema: 'public'
  }
});

export const getBrandSettings = async (adminId) => {
  try {
    // Use .select() without specifying columns to get all columns
    const { data, error } = await supabase
      .from('brand_settings')
      .select()
      .eq('admin_id', adminId)
      .single();

    if (error) {
      console.warn('No brand settings found, returning default', error);
      return {
        logo: '',
        primary_color: '#2563eb',
        secondary_color: '#ffffff',
        header_color: '#2563eb',
        admin_id: adminId
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching brand settings:', error);
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

export default supabase;
