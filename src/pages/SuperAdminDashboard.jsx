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
          ...brandSettings,
          admin_id: user.id,
          updated_at: new Date().toISOString()
        });

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
