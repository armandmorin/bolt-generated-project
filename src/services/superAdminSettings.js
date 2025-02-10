import { supabase } from '../lib/supabase';

export const getSuperAdminSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('super_admin_settings')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings exist yet, create default settings
        const defaultSettings = {
          branding: {
            logo: '',
            headerColor: '#2563eb',
            buttonColor: '#2563eb'
          },
          domain: '',
          admins: []
        };

        const { data: newData, error: insertError } = await supabase
          .from('super_admin_settings')
          .insert([{ 
            settings: defaultSettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        return defaultSettings;
      }
      throw error;
    }

    return data.settings;
  } catch (error) {
    console.error('Error fetching super admin settings:', error);
    return null;
  }
};

export const updateSuperAdminSettings = async (settings) => {
  try {
    const { data: existing } = await supabase
      .from('super_admin_settings')
      .select('id')
      .single();

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from('super_admin_settings')
        .update({ 
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Insert new settings
      const { error } = await supabase
        .from('super_admin_settings')
        .insert([{ 
          settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating super admin settings:', error);
    return false;
  }
};
