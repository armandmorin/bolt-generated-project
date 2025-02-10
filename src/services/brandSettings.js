import { supabase } from '../lib/supabase';

export const getDefaultBrandSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('is_super_admin', true)
      .single();

    if (error) {
      console.error('Error fetching default settings:', error);
      return {
        logo: '',
        primary_color: '#2563eb',
        secondary_color: '#ffffff',
        header_color: '#2563eb'
      };
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return {
      logo: '',
      primary_color: '#2563eb',
      secondary_color: '#ffffff',
      header_color: '#2563eb'
    };
  }
};

export const getAdminBrandSettings = async (adminId) => {
  try {
    if (!adminId) {
      return await getDefaultBrandSettings();
    }

    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('admin_id', adminId)
      .single();

    if (error) {
      console.error('Error fetching admin settings:', error);
      return await getDefaultBrandSettings();
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return await getDefaultBrandSettings();
  }
};

export const updateBrandSettings = async (settings, adminId) => {
  try {
    if (!adminId) {
      throw new Error('Admin ID is required');
    }

    const { data: existingSettings } = await supabase
      .from('brand_settings')
      .select('id')
      .eq('admin_id', adminId)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('brand_settings')
        .update({
          logo: settings.logo,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          header_color: settings.header_color,
          updated_at: new Date().toISOString()
        })
        .eq('admin_id', adminId);

      if (error) throw error;
    } else {
      // Create new settings
      const { error } = await supabase
        .from('brand_settings')
        .insert([{
          admin_id: adminId,
          logo: settings.logo,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          header_color: settings.header_color,
          is_super_admin: false
        }]);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating brand settings:', error);
    throw error;
  }
};

export const getBrandSettingsForHeader = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return await getDefaultBrandSettings();
    }

    return await getAdminBrandSettings(user.id);
  } catch (error) {
    console.error('Error getting brand settings for header:', error);
    return {
      logo: '',
      header_color: '#2563eb'
    };
  }
};

export const uploadLogo = async (base64Image) => {
  try {
    // Convert base64 to blob
    const blob = await fetch(base64Image).then(r => r.blob());
    const filename = `logo-${Date.now()}.${blob.type.split('/')[1]}`;

    const { data, error } = await supabase.storage
      .from('brand-assets')
      .upload(filename, blob);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};

export const applyBrandSettings = (settings) => {
  if (!settings) return;

  document.documentElement.style.setProperty('--primary-color', settings.primary_color || '#2563eb');
  document.documentElement.style.setProperty('--secondary-color', settings.secondary_color || '#ffffff');
  document.documentElement.style.setProperty('--header-color', settings.header_color || '#2563eb');
};
