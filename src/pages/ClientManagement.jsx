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
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndLoadClients = async () => {
      try {
        setIsLoading(true);
        
        // Get current authenticated user from Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Authentication error:', authError);
          setAuthError('Please log in to access this page');
          navigate('/login');
          return;
        }

        // Fetch user details from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('email', user.email)
          .single();

        if (userError || !userData) {
          console.error('User data fetch error:', userError);
          setAuthError('User profile not found');
          navigate('/login');
          return;
        }

        // Set current user
        setCurrentUser(userData);

        // Load clients based on user role
        await loadClients(userData);

      } catch (error) {
        console.error('Comprehensive error:', error);
        setAuthError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndLoadClients();
  }, [navigate]);

  async function loadClients(user) {
    try {
      let query = supabase.from('clients').select('*');

      // Role-based client filtering
      if (user.role === 'admin') {
        query = query.eq('admin_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading clients:', error);
        setAuthError('Could not load clients');
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Client loading error:', error);
      setAuthError('Failed to retrieve clients');
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
      alert('Authentication required');
      navigate('/login');
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

    await loadClients(currentUser);
    
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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading clients...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className={styles.errorContainer}>
        <p>{authError}</p>
        <button onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.clientManagement}>
      <h1>Client Management</h1>

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
          name="contactEmail"
          placeholder="Contact Email"
          value={newClient.contactEmail}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Client</button>
      </form>

      {/* Clients List */}
      <div className={styles.clientsList}>
        {filteredClients.length === 0 ? (
          <p>No clients found.</p>
        ) : (
          filteredClients.map(client => (
            <div key={client.id} className={styles.clientCard}>
              <h3>{client.name}</h3>
              <p>Website: {client.website}</p>
              <p>Contact: {client.contact_email}</p>
              <button 
                onClick={() => {
                  setSelectedClientCode(client.client_key);
                  setShowCodeModal(true);
                }}
              >
                Get Widget Code
              </button>
            </div>
          ))
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
