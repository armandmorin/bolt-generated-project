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

  useEffect(() => {
    if (user?.id) {
      loadBrandSettings();
    }
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      // First check if settings exist
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', user.id);

      if (error) {
        console.error('Load settings error:', error);
        return;
      }

      // If settings exist, use them
      if (data && data.length > 0) {
        console.log('Loaded existing settings:', data[0]);
        setBrandSettings(data[0]);
        applySettings(data[0]);
      } else {
        // If no settings exist, create default settings
        console.log('Creating default settings for user:', user.id);
        const defaultSettings = {
          ...DEFAULT_SETTINGS,
          admin_id: user.id
        };

        const { data: newData, error: insertError } = await supabase
          .from('brand_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          return;
        }

        if (newData) {
          console.log('Created default settings:', newData);
          setBrandSettings(newData);
          applySettings(newData);
        }
      }
    } catch (error) {
      console.error('Error in loadBrandSettings:', error);
    }
  };

  const applySettings = (settings) => {
    document.documentElement.style.setProperty('--primary-color', settings.primary_color);
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
    document.documentElement.style.setProperty('--header-color', settings.header_color);
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Verify authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      let logoUrl = brandSettings.logo;

      // Handle logo upload if there's a new one
      if (brandSettings.logo && brandSettings.logo.startsWith('data:image')) {
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
        admin_id: user.id
      };

      console.log('Updating settings:', settingsData);

      const { error: upsertError } = await supabase
        .from('brand_settings')
        .upsert(settingsData)
        .eq('admin_id', user.id);

      if (upsertError) throw upsertError;

      console.log('Settings updated successfully');
      alert('Brand settings updated successfully!');
      
      // Reload settings to get latest data
      await loadBrandSettings();

    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert(`Error saving brand settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

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
