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
    contactEmail: '',
    email: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndLoadClients = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const user = session.user;
        setCurrentUser(user);

        // Fetch user details to confirm role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError || !userData || (userData.role !== 'admin' && userData.role !== 'superadmin')) {
          navigate('/login');
          return;
        }

        await loadClients(user);
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndLoadClients();
  }, [navigate]);

  const loadClients = async (user) => {
    try {
      let query = supabase.from('clients').select('*');
      
      // If not a superadmin, only show clients for this admin
      if (user.user_metadata.role !== 'superadmin') {
        query = query.eq('admin_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      alert('Failed to load clients');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'contactEmail' && { email: value })
    }));
  };

  const addClient = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Authentication required');
      navigate('/login');
      return;
    }

    if (!newClient.name || !newClient.website || !newClient.email) {
      alert('Please fill in all required fields');
      return;
    }

    const clientKey = 'client_' + Math.random().toString(36).substring(2, 10);
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contactEmail,
      email: newClient.email,
      client_key: clientKey,
      status: 'active',
      admin_id: currentUser.id
    };

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClientData])
        .select();

      if (error) {
        console.error('Error adding client:', error);
        alert(`Failed to add client: ${error.message}`);
        return;
      }

      await loadClients(currentUser);
      
      setNewClient({
        name: '',
        website: '',
        contactEmail: '',
        email: ''
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred while adding the client');
    }
  };

  const deleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      await loadClients(currentUser);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client');
    }
  };

  const showWidgetCode = (clientKey) => {
    setSelectedClientCode(clientKey);
    setShowCodeModal(true);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.clientManagement}>
      <h1>Client Management</h1>

      {authError && <div className={styles.errorMessage}>{authError}</div>}

      {/* Search Input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Add Client Form */}
      <form onSubmit={addClient} className={styles.addClientForm}>
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={newClient.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={newClient.website}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Client Email"
          value={newClient.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="contactEmail"
          placeholder="Contact Email (Optional)"
          value={newClient.contactEmail}
          onChange={handleInputChange}
        />
        <button type="submit">Add Client</button>
      </form>

      {/* Clients List */}
      <div className={styles.clientsList}>
        <h2>Existing Clients</h2>
        {filteredClients.length === 0 ? (
          <p>No clients found.</p>
        ) : (
          <table className={styles.clientTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Website</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.website}</td>
                  <td>{client.email}</td>
                  <td>{client.status}</td>
                  <td>
                    <button 
                      onClick={() => showWidgetCode(client.client_key)}
                      className={styles.actionButton}
                    >
                      Widget Code
                    </button>
                    <button 
                      onClick={() => deleteClient(client.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Widget Code Modal */}
      {showCodeModal && (
        <WidgetCodeSnippet 
          clientKey={selectedClientCode}
          onClose={() => setShowCodeModal(false)}
        />
      )}
    </div>
  );
}

export default ClientManagement;
