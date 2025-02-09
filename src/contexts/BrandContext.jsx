import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentSession, getBrandSettings } from '../lib/supabase';

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff',
    header_color: '#2563eb'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const session = await getCurrentSession();
      if (!session) return;

      const settings = await getBrandSettings(session.user.id);
      
      if (settings) {
        setBrandSettings({
          logo: settings.logo || '',
          primary_color: settings.primary_color || '#2563eb',
          secondary_color: settings.secondary_color || '#ffffff',
          header_color: settings.header_color || '#2563eb'
        });

        // Set CSS variables
        document.documentElement.style.setProperty('--header-color', settings.header_color || '#2563eb');
        document.documentElement.style.setProperty('--primary-color', settings.primary_color || '#2563eb');
        document.documentElement.style.setProperty('--secondary-color', settings.secondary_color || '#ffffff');
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBrandSettings = async (newSettings) => {
    try {
      const session = await getCurrentSession();
      if (!session) return;

      await upsertBrandSettings({
        admin_id: session.user.id,
        ...newSettings,
        updated_at: new Date().toISOString()
      });

      await loadBrandSettings();
    } catch (error) {
      console.error('Error updating brand settings:', error);
      throw error;
    }
  };

  return (
    <BrandContext.Provider value={{ brandSettings, updateBrandSettings, loading }}>
      {children}
    </BrandContext.Provider>
  );
};
