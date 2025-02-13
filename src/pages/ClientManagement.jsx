import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/client.module.css';

async function getCurrentAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}

function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    email: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }
      setClients(data || []);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const generateClientKey = () => {
    return 'client_' + Math.random().toString(36).substring(2, 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addClient = async (e) => {
    e.preventDefault();
    const adminUser = await getCurrentAdmin();
    if (!adminUser || !adminUser.id) {
      alert('Admin user not found. Please log in.');
      return;
    }
    const clientKey = generateClientKey();
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      email: newClient.email,
      client_key: clientKey,
      status: 'active',
      admin_id: adminUser.id
    };

    try {
      const { error } = await supabase
        .from('clients')
        .insert([newClientData], { returning: 'minimal' });
      if (error) {
        console.error('Error adding client:', error);
        alert('Failed to add client. Please try again.');
        return;
      }
      await loadClients();
      setNewClient({
        name: '',
        website: '',
        email: ''
      });
    } catch (err) {
      console.error('Error adding client:', err);
      alert('Failed to add client. Please try again.');
    }
  };

  const toggleClientStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) {
        console.error('Error updating client status:', error);
        return;
      }
      await loadClients();
    } catch (err) {
      console.error('Error updating client status:', err);
    }
  };

  const showClientCode = (client) => {
    setSelectedClientCode(client.client_key);
    setShowCodeModal(true);
  };

  const handleEditClient = (clientId) => {
    navigate(`/client-edit/${clientId}`);
  };

  const filteredClients = clients.filter(client =>
    (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.website && client.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.clientManagement}>
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
              name="email"
              value={newClient.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className={styles.addButton}>
            Add Client
          </button>
        </form>
      </div>

      <div className={styles.clientsList}>
        <h3>Client List</h3>
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Website</th>
              <th>Email</th>
              <th>Client Key</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>
                  <a href={client.website} target="_blank" rel="noopener noreferrer">
                    {client.website}
                  </a>
                </td>
                <td>{client.email}</td>
                <td>{client.client_key}</td>
                <td>
                  <span className={`${styles.status} ${client.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.editButton} onClick={() => handleEditClient(client.id)}>
                      Edit
                    </button>
                    <button className={styles.codeButton} onClick={() => showClientCode(client)}>
                      Get Code
                    </button>
                    <button className={`${styles.statusButton} ${client.status === 'active' ? styles.statusButtonActive : styles.statusButtonInactive}`} onClick={() => toggleClientStatus(client.id, client.status)}>
                      {client.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCodeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Installation Code</h3>
            <WidgetCodeSnippet clientKey={selectedClientCode} />
            <div className={styles.modalButtons}>
              <button onClick={() => setShowCodeModal(false)} className={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientManagement;
