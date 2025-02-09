import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [globalBranding, setGlobalBranding] = useState({
    logo: '',
    header_color: '#2563eb',
    primary_color: '#2563eb',
    button_color: '#2563eb'
  });
  const [domain, setDomain] = useState(() => {
    return localStorage.getItem('widgetDomain') || '';
  });

  useEffect(() => {
    loadAdmins();
    loadBrandingSettings();
  }, []);

  const loadBrandingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setGlobalBranding(data);
        // Apply the loaded colors
        document.documentElement.style.setProperty('--header-color', data.header_color);
        document.documentElement.style.setProperty('--primary-color', data.primary_color);
        document.documentElement.style.setProperty('--button-color', data.button_color);
      }
    } catch (error) {
      console.error('Error loading branding settings:', error);
    }
  };

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setGlobalBranding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveBrandingSettings = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          id: globalBranding.id, // Will be undefined for first insert
          logo: globalBranding.logo,
          header_color: globalBranding.header_color,
          primary_color: globalBranding.primary_color,
          button_color: globalBranding.button_color,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Apply the colors immediately
      document.documentElement.style.setProperty('--header-color', globalBranding.header_color);
      document.documentElement.style.setProperty('--primary-color', globalBranding.primary_color);
      document.documentElement.style.setProperty('--button-color', globalBranding.button_color);

      alert('Global branding settings updated successfully!');
      await loadBrandingSettings(); // Reload to get the latest from database
    } catch (error) {
      console.error('Error saving branding settings:', error);
      alert('Error saving branding settings');
    } finally {
      setSaving(false);
    }
  };

  // ... rest of your component code ...

  return (
    <div className={styles.contentWidth}>
      <div className={styles.superAdminDashboard}>
        {/* ... other tab buttons ... */}
        
        <div className={styles.content}>
          {activeTab === 'branding' && (
            <div className={styles.formContainer}>
              <h2>Global Branding Settings</h2>
              <div className={styles.brandingForm}>
                <ImageUpload
                  currentImage={globalBranding.logo}
                  onImageUpload={(imageData) => {
                    setGlobalBranding(prev => ({
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
                      name="header_color"
                      value={globalBranding.header_color}
                      onChange={handleBrandingChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Primary Color</label>
                    <input
                      type="color"
                      name="primary_color"
                      value={globalBranding.primary_color}
                      onChange={handleBrandingChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Button Color</label>
                    <input
                      type="color"
                      name="button_color"
                      value={globalBranding.button_color}
                      onChange={handleBrandingChange}
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.saveButton}
                    onClick={saveBrandingSettings}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Branding Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* ... other tab content ... */}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
