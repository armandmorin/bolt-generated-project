import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/client.module.css';

function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    contactEmail: ''
  });
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

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!adminId) return;
    try {
      // Generate a unique client_key using crypto.randomUUID if available, else fallback.
      const clientKey = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString();
      const clientData = {
        name: newClient.name,
        website: newClient.website,
        email: newClient.contactEmail,
        admin_id: adminId,
        client_key: clientKey
      };
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData]);
      if (error) throw error;
      await loadClients();
      setNewClient({
        name: '',
        website: '',
        contactEmail: ''
      });
    } catch (error) {
      console.error('Error adding client:', error);
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

  return (
    <div className={styles.container}>
      <h1>Client Management</h1>
      <form onSubmit={handleAddClient} className={styles.clientForm}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            placeholder="Client Name"
            required
          />
        </div>
        <div>
          <label>Website:</label>
          <input
            type="text"
            value={newClient.website}
            onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
            placeholder="Client Website"
          />
        </div>
        <div>
          <label>Contact Email:</label>
          <input
            type="email"
            value={newClient.contactEmail}
            onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
            placeholder="Contact Email"
            required
          />
        </div>
        <button type="submit">Add Client</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {clients.length > 0 ? (
            <table className={styles.clientTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Website</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.website}</td>
                    <td>{client.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No clients found</p>
          )}
        </>
      )}
    </div>
  );
}

export default ClientManagement;
