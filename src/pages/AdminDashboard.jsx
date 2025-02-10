import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import { supabase, getBrandSettings } from '../lib/supabase';
import styles from '../styles/admin.module.css';

const DEFAULT_BRAND_SETTINGS = {
  logo: '',
  primary_color: '#2563eb',
  secondary_color: '#ffffff',
  header_color: '#2563eb'
};

const AdminDashboard = () => {
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState('clients');
  const [brandSettings, setBrandSettings] = useState(DEFAULT_BRAND_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBrandSettings();
    }
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const settings = await getBrandSettings(user.id);

      if (settings) {
        setBrandSettings(settings);
        applyBrandSettings(settings);
      } else {
        // If no settings found, use default
        setBrandSettings(DEFAULT_BRAND_SETTINGS);
        applyBrandSettings(DEFAULT_BRAND_SETTINGS);
      }
    } catch (err) {
      console.error('Error loading brand settings:', err);
      setError('Failed to load brand settings. Please try again.');
      setBrandSettings(DEFAULT_BRAND_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const applyBrandSettings = (settings) => {
    document.documentElement.style.setProperty('--primary-color', settings.primary_color || '#2563eb');
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color || '#ffffff');
    document.documentElement.style.setProperty('--header-color', settings.header_color || '#2563eb');
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { data: existingSettings } = await supabase
        .from('brand_settings')
        .select('id')
        .eq('admin_id', user.id)
        .single();

      const settingsData = {
        ...brandSettings,
        admin_id: user.id,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingSettings) {
        result = await supabase
          .from('brand_settings')
          .update(settingsData)
          .eq('admin_id', user.id);
      } else {
        result = await supabase
          .from('brand_settings')
          .insert([settingsData]);
      }

      if (result.error) {
        throw result.error;
      }

      applyBrandSettings(brandSettings);
      alert('Brand settings updated successfully!');
    } catch (error) {
      console.error('Error updating brand settings:', error);
      setError('Failed to save brand settings');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    switch (activeTab) {
      case 'clients':
        return <ClientManagement />;
      case 'widget':
        return <WidgetCustomization />;
      case 'team':
        return <TeamMembers />;
      case 'profile':
        return <ProfileSettings />;
      case 'branding':
        return (
          <div className={styles.formContainer}>
            <h2>Brand Settings</h2>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
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
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <div className={styles.loading}>Please log in to access this page.</div>;
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'widget' ? styles.active : ''}`}
          onClick={() => setActiveTab('widget')}
        >
          Widget Settings
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Brand Settings
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'team' ? styles.active : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team Members
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
