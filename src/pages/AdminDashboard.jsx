import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff',
    header_color: '#2563eb'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkSessionAndLoadSettings();
  }, []);

  const checkSessionAndLoadSettings = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate('/');
        return;
      }

      await loadBrandSettings(session.user.id);
    } catch (error) {
      console.error('Session check error:', error);
      navigate('/');
    }
  };

  const loadBrandSettings = async (userId) => {
    try {
      // First try to get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingSettings) {
        // Use existing settings
        setBrandSettings({
          logo: existingSettings.logo || '',
          primary_color: existingSettings.primary_color || '#2563eb',
          secondary_color: existingSettings.secondary_color || '#ffffff',
          header_color: existingSettings.header_color || '#2563eb'
        });

        // Set CSS variables
        document.documentElement.style.setProperty('--header-color', existingSettings.header_color || '#2563eb');
        document.documentElement.style.setProperty('--primary-color', existingSettings.primary_color || '#2563eb');
        document.documentElement.style.setProperty('--secondary-color', existingSettings.secondary_color || '#ffffff');
      } else {
        // Create default settings
        const defaultSettings = {
          admin_id: userId,
          logo: '',
          primary_color: '#2563eb',
          secondary_color: '#ffffff',
          header_color: '#2563eb'
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('brand_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) throw insertError;

        if (newSettings) {
          setBrandSettings({
            logo: newSettings.logo || '',
            primary_color: newSettings.primary_color,
            secondary_color: newSettings.secondary_color,
            header_color: newSettings.header_color
          });

          // Set CSS variables
          document.documentElement.style.setProperty('--header-color', newSettings.header_color);
          document.documentElement.style.setProperty('--primary-color', newSettings.primary_color);
          document.documentElement.style.setProperty('--secondary-color', newSettings.secondary_color);
        }
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
      // Use defaults if there's an error
      setBrandSettings({
        logo: '',
        primary_color: '#2563eb',
        secondary_color: '#ffffff',
        header_color: '#2563eb'
      });

      // Set default CSS variables
      document.documentElement.style.setProperty('--header-color', '#2563eb');
      document.documentElement.style.setProperty('--primary-color', '#2563eb');
      document.documentElement.style.setProperty('--secondary-color', '#ffffff');
    }
  };

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      let logoUrl = brandSettings.logo;

      // If there's a new logo (base64), upload it
      if (brandSettings.logo && brandSettings.logo.startsWith('data:image')) {
        logoUrl = await uploadLogo(brandSettings.logo);
      }

      // Update settings
      const { error: updateError } = await supabase
        .from('brand_settings')
        .upsert({
          admin_id: session.user.id,
          logo: logoUrl,
          primary_color: brandSettings.primary_color,
          secondary_color: brandSettings.secondary_color,
          header_color: brandSettings.header_color,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      alert('Brand settings updated successfully!');
      await loadBrandSettings(session.user.id);
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
