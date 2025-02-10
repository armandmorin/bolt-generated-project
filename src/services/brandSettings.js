import { supabase } from '../lib/supabase';

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

export const getAdminBrandSettings = async (adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  try {
    // First try to get admin-specific settings
    const { data: adminSettings, error: adminError } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('admin_id', adminId)
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

export const updateBrandSettings = async (settings, adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  try {
    const updateData = {
      logo: settings.logo,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      header_color: settings.header_color,
      admin_id: adminId,
      updated_at: new Date().toISOString()
    };

    // Check if admin settings exist
    const { data: existing } = await supabase
      .from('brand_settings')
      .select('id')
      .eq('admin_id', adminId)
      .single();

    let error;
    if (existing) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('brand_settings')
        .update(updateData)
        .eq('admin_id', adminId);
      error = updateError;
    } else {
      // Create new settings
      const { error: insertError } = await supabase
        .from('brand_settings')
        .insert([{
          ...updateData,
          is_super_admin: false
        }]);
      error = insertError;
    }

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating brand settings:', error);
    throw error;
  }
};

export const applyBrandSettings = (settings) => {
  document.documentElement.style.setProperty('--primary-color', settings.primary_color);
  document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
  document.documentElement.style.setProperty('--header-color', settings.header_color);
};

export const uploadLogo = async (base64Image) => {
  try {
    // Convert base64 to blob
    const base64Response = await fetch(base64Image);
    const blob = await base64Response.blob();

    // Create file name
    const fileName = `logo-${Date.now()}.${blob.type.split('/')[1]}`;
    const filePath = `logos/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('brand-assets')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};
