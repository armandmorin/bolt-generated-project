import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setBrandSettings({
          logo: data.logo || '',
          primary_color: data.primary_color || '#2563eb',
          secondary_color: data.secondary_color || '#ffffff'
        });
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Check if settings already exist
      const { data: existingSettings } = await supabase
        .from('brand_settings')
        .select('id')
        .single();

      let error;
      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('brand_settings')
          .update({
            logo: brandSettings.logo,
            primary_color: brandSettings.primary_color,
            secondary_color: brandSettings.secondary_color,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);
        error = updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('brand_settings')
          .insert([{
            logo: brandSettings.logo,
            primary_color: brandSettings.primary_color,
            secondary_color: brandSettings.secondary_color
          }]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      alert('Brand settings updated successfully!');
      await loadBrandSettings(); // Reload settings from the database
    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Error saving brand settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Website Branding
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'widget' ? styles.active : ''}`}
          onClick={() => setActiveTab('widget')}
        >
          Widget Preview
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Client Management
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
