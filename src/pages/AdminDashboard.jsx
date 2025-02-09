import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const DEFAULT_SETTINGS = {
  logo: '',
  header_color: '#2563eb',
  primary_color: '#2563eb',
  secondary_color: '#ffffff'  // keeping the database field name the same
};

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      setLoading(true);
      
      let { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        const { data: newData, error: insertError } = await supabase
          .from('brand_settings')
          .insert([DEFAULT_SETTINGS])
          .select()
          .single();

        if (insertError) throw insertError;
        
        data = [newData];
      }

      if (data && data[0]) {
        setBrandSettings(data[0]);
        applyColors(data[0]);
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
      setBrandSettings(DEFAULT_SETTINGS);
      applyColors(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const applyColors = (settings) => {
    document.documentElement.style.setProperty('--header-color', settings.header_color);
    document.documentElement.style.setProperty('--primary-color', settings.primary_color);
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
  };

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`#${tab}`);
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          id: brandSettings.id,
          logo: brandSettings.logo,
          header_color: brandSettings.header_color,
          primary_color: brandSettings.primary_color,
          secondary_color: brandSettings.secondary_color,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      applyColors(brandSettings);
      alert('Brand settings updated successfully!');
      await loadBrandSettings();
    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Error saving brand settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => handleTabChange('branding')}
        >
          Website Branding
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'widget' ? styles.active : ''}`}
          onClick={() => handleTabChange('widget')}
        >
          Widget Preview
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => handleTabChange('clients')}
        >
          Client Management
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'team' ? styles.active : ''}`}
          onClick={() => handleTabChange('team')}
        >
          Team Members
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          Profile
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'branding' && (
          <div className={styles.formContainer}>
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
                  <label>Content Background Color</label>
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
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'widget' && <WidgetCustomization />}
        {activeTab === 'clients' && <ClientManagement />}
        {activeTab === 'team' && <TeamMembers />}
        {activeTab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
