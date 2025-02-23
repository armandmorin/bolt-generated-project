import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/client.module.css';

function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    contactEmail: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('id, role')
            .eq('email', user.email)
            .single();

          if (userData) {
            setCurrentUser(userData);
          } else {
            console.error('No user data found:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
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
    
    if (!currentUser) {
      alert('You must be logged in to add a client.');
      return;
    }

    const clientKey = generateClientKey();
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contactEmail,
      client_key: clientKey,
      status: 'active',
      admin_id: currentUser.id
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([newClientData])
      .select();

    if (error) {
      console.error('Error adding client:', error);
      alert(`Failed to add client: ${error.message}`);
      return;
    }

    await loadClients();
    
    setNewClient({
      name: '',
      website: '',
      contactEmail: ''
    });
  };

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

  const handleCodeModal = (clientKey) => {
    setSelectedClientCode(clientKey);
    setShowCodeModal(true);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.clientManagement}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search clients..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <form onSubmit={addClient} className={styles.addClientForm}>
        <h3>Add New Client</h3>
        <div className={styles.formGroup}>
          <label>Client Name</label>
          <input
            type="text"
            name="name"
            value={newClient.name}
            onChange={handleInputChange}
            placeholder="Enter client name"
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
            placeholder="Enter client website"
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
            placeholder="Enter contact email"
            required
          />
        </div>
        <button type="submit" className={styles.addButton}>
          Add Client
        </button>
      </form>

      <div className={styles.clientsList}>
        <h3>Clients List</h3>
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Website</th>
              <th>Contact Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.website}</td>
                <td>{client.contact_email}</td>
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
                    className={styles.codeButton}
                    onClick={() => handleCodeModal(client.client_key)}
                  >
                    Get Code
                  </button>
                  <button 
                    className={`${styles.statusButton} ${
                      client.status === 'active' 
                        ? styles.statusButtonActive 
                        : styles.statusButtonInactive
                    }`}
                    onClick={() => toggleClientStatus(client.id, client.status)}
                  >
                    {client.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCodeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Widget Code Snippet</h3>
            <WidgetCodeSnippet clientKey={selectedClientCode} />
            <div className={styles.modalButtons}>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCodeModal(false)}
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
