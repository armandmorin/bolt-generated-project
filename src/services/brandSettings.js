import { supabase } from '../lib/supabase';

const DEFAULT_SETTINGS = {
  logo: '',
  primary_color: '#2563eb',
  secondary_color: '#ffffff',
  header_color: '#2563eb'
};

export const getDefaultBrandSettings = async () => {
  return DEFAULT_SETTINGS;
};

export const getAdminBrandSettings = async (adminId) => {
  try {
    // For demo purposes, return default settings
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateBrandSettings = async (settings, adminId) => {
  try {
    // For demo purposes, just return true
    return true;
  } catch (error) {
    console.error('Error updating brand settings:', error);
    throw error;
  }
};

export const getBrandSettingsForHeader = async () => {
  try {
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting brand settings for header:', error);
    return DEFAULT_SETTINGS;
  }
};

export const uploadLogo = async (base64Image) => {
  try {
    // For demo purposes, just return the base64 image
    return base64Image;
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
