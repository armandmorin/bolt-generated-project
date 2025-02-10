import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/superAdmin.module.css';

const SuperAdminDashboard = () => {
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff',
    header_color: '#2563eb'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadBrandSettings();
    }
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      console.log('Loading settings for user:', user.id);
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        console.log('Loaded settings:', data);
        setBrandSettings(data);
        // Apply settings to CSS variables
        document.documentElement.style.setProperty('--primary-color', data.primary_color);
        document.documentElement.style.setProperty('--secondary-color', data.secondary_color);
        document.documentElement.style.setProperty('--header-color', data.header_color);
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoUrl = brandSettings.logo;

      // If there's a new logo (base64), upload it
      if (brandSettings.logo && brandSettings.logo.startsWith('data:image')) {
        // Convert base64 to blob
        const base64Data = brandSettings.logo.split(',')[1];
        const blob = await fetch(`data:image/png;base64,${base64Data}`).then(r => r.blob());
        
        const fileName = `logo-${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('brand-assets')
          .upload(fileName, blob, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('brand-assets')
          .getPublicUrl(fileName);
          
        logoUrl = publicUrl;
      }

      const settingsData = {
        logo: logoUrl,
        primary_color: brandSettings.primary_color,
        secondary_color: brandSettings.secondary_color,
        header_color: brandSettings.header_color,
        admin_id: user.id,
        updated_at: new Date().toISOString()
      };

      console.log('Saving settings:', settingsData);

      // First try to update
      const { data: updateData, error: updateError } = await supabase
        .from('brand_settings')
        .update(settingsData)
        .eq('admin_id', user.id);

      // If no rows were updated, insert instead
      if (!updateData || updateError) {
        const { error: insertError } = await supabase
          .from('brand_settings')
          .insert([settingsData]);

        if (insertError) throw insertError;
      }

      alert('Brand settings updated successfully!');
      setBrandSettings(prev => ({
        ...prev,
        logo: logoUrl
      }));

      // Apply the settings
      document.documentElement.style.setProperty('--primary-color', brandSettings.primary_color);
      document.documentElement.style.setProperty('--secondary-color', brandSettings.secondary_color);
      document.documentElement.style.setProperty('--header-color', brandSettings.header_color);

      // Reload settings to ensure we have the latest data
      await loadBrandSettings();

    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Error saving brand settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Rest of the component remains the same...
  return (
    // ... existing JSX
  );
};

export default SuperAdminDashboard;
