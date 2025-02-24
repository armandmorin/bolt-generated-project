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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // If no session, try to recover session from URL
          const { data: { session: urlSession }, error: urlError } = 
            await supabase.auth.getSessionFromUrl();
          
          if (urlError || !urlSession) {
            console.error('No active session found:', error || urlError);
            navigate('/login');
            return;
          }
          
          // Set session from URL
          await supabase.auth.setSession(urlSession);
          setAdminId(urlSession.user.id);
          loadClients();
          return;
        }

        // Set session from existing session
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
  }, [navigate]);

  // ... rest of the component remains the same
}

export default ClientManagement;
