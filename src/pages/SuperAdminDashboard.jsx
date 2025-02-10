import React, { useState, useEffect } from 'react';
import { getSuperAdminSettings, updateSuperAdminSettings } from '../services/superAdminSettings';
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
    headerColor: '#2563eb',
    buttonColor: '#2563eb'
  });
  const [domain, setDomain] = useState(() => {
    return localStorage.getItem('widgetDomain') || '';
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSuperAdminSettings();
      if (settings) {
        setGlobalBranding(settings.branding || {
          logo: '',
          headerColor: '#2563eb',
          buttonColor: '#2563eb'
        });
        setDomain(settings.domain || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleDomainSave = async (e) => {
    e.preventDefault();
    const settings = await getSuperAdminSettings();
    const success = await updateSuperAdminSettings({
      ...settings,
      domain: domain
    });
    if (success) {
      alert('Domain settings updated successfully!');
    } else {
      alert('Failed to update domain settings');
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
    const settings = await getSuperAdminSettings();
    const success = await updateSuperAdminSettings({
      ...settings,
      branding: globalBranding
    });
    if (success) {
      alert('Global branding settings updated successfully!');
    } else {
      alert('Failed to update branding settings');
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
    const settings = await getSuperAdminSettings();
    const admins = settings.admins || [];
    const updatedAdmins = [...admins, {
      ...newAdmin,
      id: Date.now(),
      clients: [],
      dateCreated: new Date().toISOString()
    }];

    const success = await updateSuperAdminSettings({
      ...settings,
      admins: updatedAdmins
    });

    if (success) {
      setAdmins(updatedAdmins);
      setNewAdmin({ name: '', email: '', password: '', company: '' });
      alert('Admin added successfully!');
    } else {
      alert('Failed to add admin');
    }
  };

  const removeAdmin = async (adminId) => {
    const settings = await getSuperAdminSettings();
    const updatedAdmins = settings.admins.filter(admin => admin.id !== adminId);
    
    const success = await updateSuperAdminSettings({
      ...settings,
      admins: updatedAdmins
    });

    if (success) {
      setAdmins(updatedAdmins);
      alert('Admin removed successfully!');
    } else {
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
                    name="headerColor"
                    value={globalBranding.headerColor}
                    onChange={handleBrandingChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Button Color</label>
                  <input
                    type="color"
                    name="buttonColor"
                    value={globalBranding.buttonColor}
                    onChange={handleBrandingChange}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.saveButton}
                  onClick={saveBrandingSettings}
                >
                  Save Branding Settings
                </button>
              </div>
            </div>
          </div>
        )}

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
