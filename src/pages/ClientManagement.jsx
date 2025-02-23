import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getCurrentUserRole } from '../lib/supabase';
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

        // Use the new getCurrentUserRole function
        const userRole = await getCurrentUserRole();

        if (!userRole || (userRole !== 'admin' && userRole !== 'superadmin')) {
          console.error('Unauthorized access', { userRole });
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

  // Rest of the component remains the same...

  return (
    <div className={styles.clientManagement}>
      {/* Existing JSX remains the same */}
      {authError && (
        <div className={styles.errorMessage}>
          Authentication Error: {authError}
        </div>
      )}
      {/* Rest of the component remains the same */}
    </div>
  );
}

export default ClientManagement;
