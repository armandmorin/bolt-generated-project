import { supabase } from './supabase';

export const getSuperAdminSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('super_admin_settings')
      .select('settings')
      .single();

    if (error) throw error;

    return data?.settings || {};
  } catch (error) {
    console.error('Error fetching super admin settings:', error);
    return {};
  }
};

export const updateSuperAdminSettings = async (settings) => {
  try {
    const { data: existingSettings } = await supabase
      .from('super_admin_settings')
      .select('id')
      .single();

    let error;
    if (existingSettings) {
      const { error: updateError } = await supabase
        .from('super_admin_settings')
        .update({
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('super_admin_settings')
        .insert([{
          settings
        }]);
      error = insertError;
    }

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating super admin settings:', error);
    return false;
  }
};
