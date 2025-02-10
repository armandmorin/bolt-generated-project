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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBrandSettings();
    }
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      setLoading(true);
      
      // First, check if settings exist
      const { count, error: countError } = await supabase
        .from('brand_settings')
        .select('*', { count: 'exact', head: true })
        .eq('admin_id', user.id);

      if (countError) {
        console.error('Error checking settings:', countError);
        return;
      }

      if (count === 0) {
        // No settings exist, create default settings
        console.log('Creating default settings...');
        const { data: newSettings, error: insertError } = await supabase
          .from('brand_settings')
          .insert([{
            admin_id: user.id,
            ...DEFAULT_SETTINGS,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select('*')
          .single();

        if (insertError) {
          console.error('Error creating settings:', insertError);
          return;
        }

        setBrandSettings(newSettings || DEFAULT_SETTINGS);
        applySettings(newSettings || DEFAULT_SETTINGS);
      } else {
        // Settings exist, fetch them
        console.log('Fetching existing settings...');
        const { data: existingSettings, error: fetchError } = await supabase
          .from('brand_settings')
          .select('*')
          .eq('admin_id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching settings:', fetchError);
          return;
        }

        setBrandSettings(existingSettings || DEFAULT_SETTINGS);
        applySettings(existingSettings || DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error in loadBrandSettings:', error);
    } finally {
      setLoading(false);
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
      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          admin_id: user.id,
          ...brandSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'admin_id'
        });

      if (error) throw error;

      applySettings(brandSettings);
      alert('Brand settings updated successfully!');
      await loadBrandSettings(); // Reload settings after update
    } catch (error) {
      console.error('Error updating brand settings:', error);
      alert('Error updating brand settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.superAdminDashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Brand Settings
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'admins' ? styles.active : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Manage Admins
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'branding' && (
          <div className={styles.formContainer}>
            <h2>Brand Settings</h2>
            <form onSubmit={handleBrandUpdate}>
              <ImageUpload
                currentImage={brandSettings.logo}
                onImageUpload={(imageData) => {
                  setBrandSettings(prev => ({
                    ...prev,
                    logo: imageData
                  }));
                }}
                label="Company Logo"
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
                  {saving ? 'Saving...' : 'Save Brand Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className={styles.adminSection}>
            {/* Admin management content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
