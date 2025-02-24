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
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    if (!adminId) return;
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('admin_id', adminId);
      if (error) throw error;
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          const { data: { session: urlSession }, error: urlError } = await supabase.auth.getSessionFromUrl();
          if (urlError || !urlSession) {
            console.error('No active session found:', error || urlError);
            navigate('/login');
            return;
          }
          await supabase.auth.setSession(urlSession);
          setAdminId(urlSession.user.id);
          loadClients();
          return;
        }
        setAdminId(session.user.id);
        loadClients();
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Render your client management UI here
  return (
    <div className={styles.container}>
      <h1>Client Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {clients.length > 0 ? (
            <ul>
              {clients.map((client) => (
                <li key={client.id}>{client.name}</li>
              ))}
            </ul>
          ) : (
            <p>No clients found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientManagement;
