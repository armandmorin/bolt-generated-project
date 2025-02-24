import React, { useState } from 'react';
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
        primaryColor: '#2563eb',
        secondaryColor: '#ffffff'
      });

      const handleBrandUpdate = (e) => {
        e.preventDefault();
        localStorage.setItem('brandSettings', JSON.stringify(brandSettings));
        alert('Brand settings updated successfully!');
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
                        value={brandSettings.primaryColor}
                        onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Secondary Color</label>
                      <input
                        type="color"
                        value={brandSettings.secondaryColor}
                        onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryButton}>
                      Save Changes
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
