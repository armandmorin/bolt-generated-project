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
      console.log('Loading settings for user ID:', user.id);
      
      // First try to get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error

      if (fetchError) {
        console.error('Error fetching settings:', fetchError);
        return;
      }

      if (existingSettings) {
        console.log('Found existing settings:', existingSettings);
        setBrandSettings(existingSettings);
        applySettings(existingSettings);
      } else {
        console.log('No existing settings found, using defaults...');
        setBrandSettings(DEFAULT_SETTINGS);
        applySettings(DEFAULT_SETTINGS);
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
      const settingsData = {
        ...brandSettings,
        admin_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data: existingSettings } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', user.id)
        .maybeSingle();

      let error;
      if (existingSettings) {
        const { error: updateError } = await supabase
          .from('brand_settings')
          .update(settingsData)
          .eq('admin_id', user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('brand_settings')
          .insert([{ ...settingsData, created_at: new Date().toISOString() }]);
        error = insertError;
      }

      if (error) throw error;

      applySettings(brandSettings);
      alert('Brand settings updated successfully!');
    } catch (error) {
      console.error('Error updating brand settings:', error);
      alert('Error updating brand settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Rest of the component remains the same...
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
            <div className={styles.addAdminSection}>
              <h2>Add New Admin</h2>
              <form className={styles.addAdminForm}>
                <div className={styles.formGroup}>
                  <label>Admin Name</label>
                  <input type="text" placeholder="Enter admin name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Admin Email</label>
                  <input type="email" placeholder="Enter admin email" />
                </div>
                <button type="submit" className={styles.addButton}>
                  Add Admin
                </button>
              </form>
            </div>

            <div className={styles.adminListSection}>
              <h2>Current Admins</h2>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Added Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Admin list would go here */}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
