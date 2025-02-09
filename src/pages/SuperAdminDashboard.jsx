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
    button_color: '#2563eb',
    widget_domain: ''
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
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setGlobalBranding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDomainSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          id: globalBranding.id,
          widget_domain: globalBranding.widget_domain,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert('Domain settings updated successfully!');
      await loadBrandingSettings();
    } catch (error) {
      console.error('Error saving domain settings:', error);
      alert('Error saving domain settings');
    } finally {
      setSaving(false);
    }
  };

  const saveBrandingSettings = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          id: globalBranding.id,
          logo: globalBranding.logo,
          header_color: globalBranding.header_color,
          primary_color: globalBranding.primary_color,
          button_color: globalBranding.button_color,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      document.documentElement.style.setProperty('--header-color', globalBranding.header_color);
      document.documentElement.style.setProperty('--primary-color', globalBranding.primary_color);
      document.documentElement.style.setProperty('--button-color', globalBranding.button_color);

      alert('Global branding settings updated successfully!');
      await loadBrandingSettings();
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
        <div className={styles.tabs}>
          {/* ... tab buttons ... */}
        </div>

        <div className={styles.content}>
          {/* ... branding tab content ... */}

          {activeTab === 'domain' && (
            <div className={styles.formContainer}>
              <h2>Widget Domain Configuration</h2>
              <p className={styles.description}>
                Set the domain where the accessibility widget will be hosted. 
                This domain will be used in the installation code provided to clients.
              </p>
              <form onSubmit={handleDomainSave}>
                <div className={styles.formGroup}>
                  <label>Widget Domain</label>
                  <input
                    type="url"
                    name="widget_domain"
                    value={globalBranding.widget_domain || ''}
                    onChange={handleBrandingChange}
                    placeholder="https://widget.yourdomain.com"
                    required
                  />
                  <span className={styles.hint}>
                    Example: https://widget.yourdomain.com or https://yourdomain.com/widget
                  </span>
                </div>
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Domain'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ... admin tab content ... */}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
