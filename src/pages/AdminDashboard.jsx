import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useBrand } from '../contexts/BrandContext';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { brandSettings, updateBrandSettings } = useBrand();
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);

  const uploadLogo = async (base64Image) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return null;
      }

      // Convert base64 to blob
      const base64Response = await fetch(base64Image);
      const blob = await base64Response.blob();

      // Create file name
      const fileName = `logo-${session.user.id}-${Date.now()}.${blob.type.split('/')[1]}`;
      const filePath = `logos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoUrl = brandSettings.logo;

      // If there's a new logo (base64), upload it
      if (brandSettings.logo && brandSettings.logo.startsWith('data:image')) {
        logoUrl = await uploadLogo(brandSettings.logo);
      }

      await updateBrandSettings({
        ...brandSettings,
        logo: logoUrl
      });

      alert('Brand settings updated successfully!');
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
                  updateBrandSettings({
                    ...brandSettings,
                    logo: imageData
                  });
                }}
                label="Company Logo"
              />

              <div className={styles.colorGroup}>
                <div className={styles.formGroup}>
                  <label>Header Color</label>
                  <input
                    type="color"
                    value={brandSettings.header_color}
                    onChange={(e) => updateBrandSettings({
                      ...brandSettings,
                      header_color: e.target.value
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Primary Color</label>
                  <input
                    type="color"
                    value={brandSettings.primary_color}
                    onChange={(e) => updateBrandSettings({
                      ...brandSettings,
                      primary_color: e.target.value
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Secondary Color</label>
                  <input
                    type="color"
                    value={brandSettings.secondary_color}
                    onChange={(e) => updateBrandSettings({
                      ...brandSettings,
                      secondary_color: e.target.value
                    })}
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
