import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const BrandSettingsProvider = ({ children }) => {
  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Set CSS variables
        document.documentElement.style.setProperty('--primary-color', data.primary_color || '#2563eb');
        document.documentElement.style.setProperty('--secondary-color', data.secondary_color || '#ffffff');
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  return <>{children}</>;
};

export default BrandSettingsProvider;
