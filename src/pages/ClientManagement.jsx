import React, { useState, useEffect } from 'react';
    import styles from '../styles/client.module.css';

    const ClientManagement = () => {
      const [clients, setClients] = useState([]);
      const [newClient, setNewClient] = useState({
        name: '',
        website: '',
        contactEmail: ''
      });
      const [searchQuery, setSearchQuery] = useState('');

      // Load clients from localStorage
      useEffect(() => {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          setClients(JSON.parse(savedClients));
        }
      }, []);

      const handleInputChange = (e) => {
        setNewClient({
          ...newClient,
          [e.target.name]: e.target.value
        });
      };

      const addClient = (e) => {
        e.preventDefault();
        const updatedClients = [...clients, {
          ...newClient,
          id: Date.now(),
          status: 'active',
          scriptKey: generateScriptKey()
        }];
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        setNewClient({ name: '', website: '', contactEmail: '' });
      };

      const toggleClientStatus = (id) => {
        const updatedClients = clients.map(client => 
          client.id === id ? { ...client, status: client.status === 'active' ? 'inactive' : 'active' } : client
        );
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
      };

      const generateScriptKey = () => {
        return 'sk_' + Math.random().toString(36).substr(2, 16);
      };

      const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div className={styles.clientManagement}>
          <h2>Client Management</h2>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.addClientForm}>
            <h3>Add New Client</h3>
            <form onSubmit={addClient}>
              <div className={styles.formGroup}>
                <label>Client Name</label>
                <input
                  type="text"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={newClient.website}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={newClient.contactEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className={styles.primaryButton}>
                Add Client
              </button>
            </form>
          </div>

          <div className={styles.clientsList}>
            <h3>Client List</h3>
            <table className={styles.clientTable}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Name</th>
                  <th>Website</th>
                  <th>Status</th>
                  <th>Script Key</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{client.name}</td>
                    <td className={styles.tableCell}>
                      <a href={client.website} target="_blank" rel="noopener noreferrer">
                        {client.website}
                      </a>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.status} ${client.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.scriptKey}>
                        {client.scriptKey}
                        <button
                          className={styles.copyButton}
                          onClick={() => navigator.clipboard.writeText(client.scriptKey)}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        className={`${styles.statusButton} ${client.status === 'active' ? styles.statusButtonActive : styles.statusButtonInactive}`}
                        onClick={() => toggleClientStatus(client.id)}
                      >
                        {client.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    export default ClientManagement;
