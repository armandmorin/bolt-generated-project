import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/client.module.css';

function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    contactEmail: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading clients:', error);
      return;
    }

    if (data) {
      setClients(data);
    }
  }

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
    
    const clientKey = generateClientKey();
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contactEmail, // Note the underscore
      client_key: clientKey,
      status: 'active'
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([newClientData])
      .select();

    if (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
      return;
    }

    await loadClients();
    
    setNewClient({
      name: '',
      website: '',
      contactEmail: ''
    });
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleClientStatus = async (clientId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from('clients')
      .update({ status: newStatus })
      .eq('id', clientId);

    if (error) {
      console.error('Error updating client status:', error);
      return;
    }

    await loadClients();
  };

  const editClient = (client) => {
    navigate('/client-edit', { state: { client } });
  };

  const showWidgetCode = (clientKey) => {
    setSelectedClientCode(clientKey);
    setShowCodeModal(true);
  };

  const closeCodeModal = () => {
    setShowCodeModal(false);
    setSelectedClientCode('');
  };

  return (
    <div className={styles.clientManagement}>
      <h2>Client Management</h2>

      {/* Search Section */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search clients..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Client Form */}
      <form className={styles.addClientForm} onSubmit={addClient}>
        <h3>Add New Client</h3>
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
          <label>Website</label>
          <input
            type="text"
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
        <button type="submit" className={styles.addButton}>
          Add Client
        </button>
      </form>

      {/* Clients List */}
      <div className={styles.clientsList}>
        <h3>Existing Clients</h3>
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Website</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.website}</td>
                <td>
                  <span 
                    className={`${styles.status} ${
                      client.status === 'active' 
                        ? styles.statusActive 
                        : styles.statusInactive
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className={styles.actionButtons}>
                  <button 
                    onClick={() => editClient(client)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => showWidgetCode(client.client_key)}
                    className={styles.codeButton}
                  >
                    Widget Code
                  </button>
                  <button 
                    onClick={() => toggleClientStatus(client.id, client.status)}
                    className={`${styles.statusButton} ${
                      client.status === 'active' 
                        ? styles.statusButtonActive 
                        : styles.statusButtonInactive
                    }`}
                  >
                    {client.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Widget Code Modal */}
      {showCodeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <WidgetCodeSnippet clientKey={selectedClientCode} />
            <div className={styles.modalButtons}>
              <button 
                onClick={closeCodeModal} 
                className={styles.closeButton}
              >
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
