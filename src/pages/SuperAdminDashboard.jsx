import React, { useState, useEffect } from 'react';
import { getDefaultBrandSettings, updateBrandSettings, applyBrandSettings, uploadLogo } from '../services/brandSettings';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/superAdmin.module.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [globalBranding, setGlobalBranding] = useState({
    logo: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff',
    header_color: '#2563eb'
  });
  const [domain, setDomain] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBrandSettings();
  }, []);

  useEffect(() => {
    applyBrandSettings(globalBranding);
  }, [globalBranding]);

  const loadBrandSettings = async () => {
    try {
      const settings = await getDefaultBrandSettings();
      setGlobalBranding(settings);
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoUrl = globalBranding.logo;

      // If there's a new logo (base64), upload it
      if (globalBranding.logo && globalBranding.logo.startsWith('data:image')) {
        logoUrl = await uploadLogo(globalBranding.logo);
      }

      const settingsToUpdate = {
        ...globalBranding,
        logo: logoUrl
      };

      const success = await updateBrandSettings(settingsToUpdate, null, true);
      
      if (success) {
        alert('Global branding settings updated successfully!');
        setGlobalBranding(settingsToUpdate);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Failed to update branding settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to create a new admin
      // For now, we'll just add to local state
      const newAdminData = {
        ...newAdmin,
        id: Date.now(),
        clients: [],
        dateCreated: new Date().toISOString()
      };

      setAdmins(prev => [...prev, newAdminData]);
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        company: ''
      });
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin');
    }
  };

  const removeAdmin = async (adminId) => {
    try {
      // Here you would typically make an API call to remove the admin
      // For now, we'll just remove from local state
      setAdmins(prev => prev.filter(admin => admin.id !== adminId));
      alert('Admin removed successfully!');
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Failed to remove admin');
    }
  };

  return (
    <div className={styles.superAdminDashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Global Branding
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'domain' ? styles.active : ''}`}
          onClick={() => setActiveTab('domain')}
        >
          Domain Settings
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'admins' ? styles.active : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admin Management
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'branding' && (
          <div className={styles.formContainer}>
            <h2>Global Branding Settings</h2>
            <p className={styles.description}>
              These settings will serve as the default for all new admins.
            </p>
            <form onSubmit={handleBrandUpdate}>
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
                    value={globalBranding.header_color}
                    onChange={(e) => setGlobalBranding(prev => ({
                      ...prev,
                      header_color: e.target.value
                    }))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Primary Color</label>
                  <input
                    type="color"
                    value={globalBranding.primary_color}
                    onChange={(e) => setGlobalBranding(prev => ({
                      ...prev,
                      primary_color: e.target.value
                    }))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Secondary Color</label>
                  <input
                    type="color"
                    value={globalBranding.secondary_color}
                    onChange={(e) => setGlobalBranding(prev => ({
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
                  {saving ? 'Saving...' : 'Save Branding Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className={styles.formContainer}>
            <h2>Widget Domain Configuration</h2>
            <p className={styles.description}>
              Set the domain where the accessibility widget will be hosted. 
              This domain will be used in the installation code provided to clients.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle domain save
            }}>
              <div className={styles.formGroup}>
                <label>Widget Domain</label>
                <input
                  type="url"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://widget.yourdomain.com"
                  required
                />
                <span className={styles.hint}>
                  Example: https://widget.yourdomain.com or https://yourdomain.com/widget
                </span>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className={styles.adminSection}>
            <div className={styles.addAdminSection}>
              <h2>Add New Admin</h2>
              <form onSubmit={addAdmin} className={styles.addAdminForm}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={newAdmin.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className={styles.addButton}>
                  Add Admin
                </button>
              </form>
            </div>

            <div className={styles.adminListSection}>
              <h2>Admin List</h2>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Clients</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.company}</td>
                      <td>{admin.clients.length}</td>
                      <td>{new Date(admin.dateCreated).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={styles.removeButton}
                          onClick={() => removeAdmin(admin.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
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
