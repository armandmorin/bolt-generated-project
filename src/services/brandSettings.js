import { supabase } from '../lib/supabase';

export const getCurrentUser = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');
  return user;
};

export const getDefaultBrandSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('is_super_admin', true)
      .single();

    if (error) throw error;

    return data || {
      logo: '',
      primary_color: '#2563eb',
      secondary_color: '#ffffff',
      header_color: '#2563eb'
    };
  } catch (error) {
    console.error('Error fetching default brand settings:', error);
    return {
      logo: '',
      primary_color: '#2563eb',
      secondary_color: '#ffffff',
      header_color: '#2563eb'
    };
  }
};

export const getAdminBrandSettings = async () => {
  try {
    const user = await getCurrentUser();
    
    // If super admin, return default settings
    if (user.role === 'superadmin') {
      return await getDefaultBrandSettings();
    }

    // Get admin-specific settings
    const { data: adminSettings, error: adminError } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('admin_id', user.id)
      .single();

    if (!adminError && adminSettings) {
      return adminSettings;
    }

    // If no admin settings exist, get default settings
    return await getDefaultBrandSettings();
  } catch (error) {
    console.error('Error fetching admin brand settings:', error);
    return await getDefaultBrandSettings();
  }
};

// ... rest of the service remains the same
