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

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First, check local storage for user info
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Try to fetch user from Supabase
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          
          if (authError) {
            console.error('Supabase auth error:', authError);
            setAuthError('Authentication failed. Please log in again.');
            return;
          }

          if (user) {
            // Fetch additional user details from users table
            const { data: userData, error } = await supabase
              .from('users')
              .select('id, email, role')
              .eq('email', user.email)
              .single();

            if (userData) {
              setCurrentUser(userData);
              setAuthError(null);
            } else {
              console.error('No user data found:', error);
              setAuthError('User data not found. Please log in again.');
            }
          } else {
            setAuthError('No active user session. Please log in.');
          }
        } else {
          setAuthError('No user logged in. Please log in.');
        }

        // Load clients regardless of authentication status
        await loadClients();
      } catch (error) {
        console.error('Authentication check error:', error);
        setAuthError('An unexpected error occurred. Please try again.');
      }
    };

    checkAuthentication();
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
    
    // Enhanced authentication check
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('You must be logged in to add a client.');
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    if (!currentUser) {
      alert('Authentication failed. Please log in again.');
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

    await loadClients();
    
    setNewClient({
      name: '',
      website: '',
      contactEmail: ''
    });
  };

  // ... rest of the component remains the same as in the previous version

  return (
    <div className={styles.clientManagement}>
      {authError && (
        <div className={styles.authErrorBanner}>
          {authError}
          <button 
            onClick={() => navigate('/login')} 
            className={styles.loginRedirectButton}
          >
            Go to Login
          </button>
        </div>
      )}

      {/* Rest of the existing JSX */}
      {/* ... */}
    </div>
  );
}

export default ClientManagement;
