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
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
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

      const settingsToUpdate = {
        logo: logoUrl,
        primary_color: brandSettings.primary_color,
        secondary_color: brandSettings.secondary_color,
        header_color: brandSettings.header_color,
        admin_id: user.id
      };

      const { error: upsertError } = await supabase
        .from('brand_settings')
        .upsert(settingsToUpdate, { 
          onConflict: 'admin_id',
          returning: 'minimal'
        });

      if (upsertError) throw upsertError;

      alert('Brand settings updated successfully!');
      setBrandSettings(prev => ({
        ...prev,
        logo: logoUrl
      }));

      // Apply the settings
      document.documentElement.style.setProperty('--primary-color', brandSettings.primary_color);
      document.documentElement.style.setProperty('--secondary-color', brandSettings.secondary_color);
      document.documentElement.style.setProperty('--header-color', brandSettings.header_color);

    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Error saving brand settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.superAdminDashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Global Branding
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'domain' ? styles.active : ''}`}
          onClick={() => setActiveTab('domain')}
        >
          Domain Settings
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'admins' ? styles.active : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admin Management
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h2>Global Branding Settings</h2>
          <p className={styles.description}>
            These settings will serve as the default for all new admins.
          </p>
          <form onSubmit={handleBrandUpdate}>
            <ImageUpload
              currentImage={brandSettings.logo}
              onImageUpload={(imageData) => {
                setBrandSettings(prev => ({
                  ...prev,
                  logo: imageData
                }));
              }}
              label="Default Logo"
            />

            <div className={styles.colorGroup}>
              <div className={styles.formGroup}>
                <label>Header Color</label>
                <input
                  type="color"
                  value={brandSettings.header_color}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    header_color: e.target.value
                  }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Primary Color</label>
                <input
                  type="color"
                  value={brandSettings.primary_color}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    primary_color: e.target.value
                  }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Secondary Color</label>
                <input
                  type="color"
                  value={brandSettings.secondary_color}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    secondary_color: e.target.value
                  }))}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Branding Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
