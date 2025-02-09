import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/clientDashboard.module.css';

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user?.email) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;

      setClientData(data);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.clientDashboard}>
      <h1>Client Dashboard</h1>
      {clientData && (
        <div className={styles.scriptInstructions}>
          <h2>Installation Instructions</h2>
          <p>Add this script to your website:</p>
          <div className={styles.codeBlock}>
            <code>
              {`<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script>
  (function() {
    const script = document.createElement('script');
    script.src = "${window.location.origin}/widget/accessibility-widget.js";
    script.setAttribute('data-client-key', '${clientData.client_key}');
    document.body.appendChild(script);
  })();
</script>`}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
