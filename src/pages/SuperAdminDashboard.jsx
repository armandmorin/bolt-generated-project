import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/superAdmin.module.css';

const DEFAULT_SETTINGS = {
  logo: '',
  primary_color: '#2563eb',
  secondary_color: '#ffffff',
  header_color: '#2563eb'
};

const SuperAdminDashboard = () => {
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  // Debug authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('Current user:', user);
      
      // Get auth token
      const token = session?.access_token;
      console.log('Auth token exists:', !!token);
    };
    checkAuth();
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadBrandSettings();
    }
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      console.log('Loading settings for user ID:', user.id);
      
      // First try to get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', user.id);

      if (fetchError) {
        console.error('Error fetching settings:', fetchError);
        return;
      }

      if (existingSettings && existingSettings.length > 0) {
        console.log('Found existing settings:', existingSettings[0]);
        setBrandSettings(existingSettings[0]);
        applySettings(existingSettings[0]);
      } else {
        console.log('No existing settings found, creating default...');
        
        // Create default settings
        const defaultSettings = {
          ...DEFAULT_SETTINGS,
          admin_id: user.id
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('brand_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          return;
        }

        if (newSettings) {
          console.log('Created default settings:', newSettings);
          setBrandSettings(newSettings);
          applySettings(newSettings);
        }
      }
    } catch (error) {
      console.error('Error in loadBrandSettings:', error);
    }
  };

  // Rest of the component remains the same...
  
  return (
    // ... existing JSX
  );
};

export default SuperAdminDashboard;
