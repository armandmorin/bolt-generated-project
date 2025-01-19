import React, { useState, useEffect } from 'react';
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

      useEffect(() => {
        const savedAdmins = localStorage.getItem('admins');
        if (savedAdmins) {
          setAdmins(JSON.parse(savedAdmins));
        }

        const savedBranding = localStorage.getItem('globalBranding');
        if (savedBranding) {
          setGlobalBranding(JSON.parse(savedBranding));
        }
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const handleBrandingChange = (e) => {
        const { name, value } = e.target;
        setGlobalBranding(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const saveBrandingSettings = () => {
        localStorage.setItem('globalBranding', JSON.stringify(globalBranding));
        localStorage.setItem('brandSettings', JSON.stringify({
          logo: globalBranding.logo,
          primaryColor: globalBranding.headerColor,
          buttonColor: globalBranding.buttonColor
        }));
        alert('Global branding settings updated successfully!');
      };

      const addAdmin = (e) => {
        e.preventDefault();
        const updatedAdmins = [...admins, {
          ...newAdmin,
          id: Date.now(),
          clients: [],
          dateCreated: new Date().toISOString()
        }];
        setAdmins(updatedAdmins);
        localStorage.setItem('admins', JSON.stringify(updatedAdmins));
        setNewAdmin({ name: '', email: '', password: '', company: '' });
      };

      const removeAdmin = (adminId) => {
        const updatedAdmins = admins.filter(admin => admin.id !== adminId);
        setAdmins(updatedAdmins);
        localStorage.setItem('admins', JSON.stringify(updatedAdmins));
      };

      return (
        <div className={styles.superAdminDashboard}>
          <div className={styles.header}>
            <h1>Super Admin Dashboard</h1>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
              onClick={() => setActiveTab('branding')}
            >
              Global Branding
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
              <div className={styles.brandingSection}>
                <h2>Global Branding Settings</h2>
                <div className={styles.brandingForm}>
                  <div className={styles.formGroup}>
                    <label>Default Logo URL</label>
                    <input
                      type="url"
                      name="logo"
                      value={globalBranding.logo}
                      onChange={handleBrandingChange}
                      placeholder="Enter logo URL"
                    />
                  </div>

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

                  <button 
                    type="button" 
                    className={styles.saveButton}
                    onClick={saveBrandingSettings}
                  >
                    Save Branding Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'admins' && (
              <>
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
                  <div className={styles.adminList}>
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
              </>
            )}
          </div>
        </div>
      );
    };

    export default SuperAdminDashboard;
