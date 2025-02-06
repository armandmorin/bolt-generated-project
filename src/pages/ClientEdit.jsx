import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import styles from '../styles/clientEdit.module.css';

function ClientEdit() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [widgetSettings, setWidgetSettings] = useState({
    header_color: '',
    header_text_color: '',
    button_color: '',
    powered_by_text: '',
    powered_by_color: '',
    button_size: '64px',
    button_position: 'bottom-right'
  });
  const [activeTab, setActiveTab] = useState('details');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  async function loadClientData() {
    try {
      // Load client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*, widget_settings(*)')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;

      setClient(clientData);
      
      // If client has custom widget settings, use them
      if (clientData.widget_settings) {
        setWidgetSettings(clientData.widget_settings);
      } else {
        // Load default settings
        const { data: defaultSettings } = await supabase
          .from('global_widget_settings')
          .select('*')
          .limit(1)
          .single();

        if (defaultSettings) {
          setWidgetSettings(defaultSettings);
        }
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      alert('Error loading client data');
    }
  }

  const handleClientUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          name: client.name,
          website: client.website,
          contact_email: client.contact_email
        })
        .eq('id', clientId);

      if (updateError) throw updateError;

      // Update or insert widget settings
      const { data: existingSettings } = await supabase
        .from('widget_settings')
        .select('id')
        .eq('client_id', clientId)
        .single();

      if (existingSettings) {
        await supabase
          .from('widget_settings')
          .update(widgetSettings)
          .eq('client_id', clientId);
      } else {
        await supabase
          .from('widget_settings')
          .insert({
            ...widgetSettings,
            client_id: clientId
          });
      }

      alert('Client updated successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setWidgetSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  if (!client) return <div>Loading...</div>;

  return (
    <div className={styles.clientEdit}>
      <div className={styles.header}>
        <h2>Edit Client: {client.name}</h2>
        <button onClick={() => navigate('/admin')} className={styles.backButton}>
          Back to Clients
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Client Details
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'widget' ? styles.active : ''}`}
          onClick={() => setActiveTab('widget')}
        >
          Widget Settings
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'details' ? (
          <form onSubmit={handleClientUpdate} className={styles.detailsForm}>
            <div className={styles.formGroup}>
              <label>Client Name</label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Website</label>
              <input
                type="url"
                value={client.website}
                onChange={(e) => setClient({ ...client, website: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Contact Email</label>
              <input
                type="email"
                value={client.contact_email}
                onChange={(e) => setClient({ ...client, contact_email: e.target.value })}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.widgetSettings}>
            <div className={styles.settingsPanel}>
              <div className={styles.settingsGroup}>
                <h3>Header Settings</h3>
                <div className={styles.formGroup}>
                  <label>Header Background Color</label>
                  <input
                    type="color"
                    value={widgetSettings.header_color}
                    onChange={(e) => handleSettingChange('header_color', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Header Text Color</label>
                  <input
                    type="color"
                    value={widgetSettings.header_text_color}
                    onChange={(e) => handleSettingChange('header_text_color', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.settingsGroup}>
                <h3>Button Settings</h3>
                <div className={styles.formGroup}>
                  <label>Button Color</label>
                  <input
                    type="color"
                    value={widgetSettings.button_color}
                    onChange={(e) => handleSettingChange('button_color', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Button Size</label>
                  <select
                    value={widgetSettings.button_size}
                    onChange={(e) => handleSettingChange('button_size', e.target.value)}
                  >
                    <option value="48px">Small</option>
                    <option value="64px">Medium</option>
                    <option value="80px">Large</option>
                  </select>
                </div>
              </div>

              <div className={styles.settingsGroup}>
                <h3>Footer Settings</h3>
                <div className={styles.formGroup}>
                  <label>Powered By Text</label>
                  <input
                    type="text"
                    value={widgetSettings.powered_by_text}
                    onChange={(e) => handleSettingChange('powered_by_text', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Powered By Color</label>
                  <input
                    type="color"
                    value={widgetSettings.powered_by_color}
                    onChange={(e) => handleSettingChange('powered_by_color', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  onClick={handleClientUpdate}
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className={styles.previewPanel}>
              <h3>Widget Preview</h3>
              <div className={styles.previewContainer}>
                <AccessibilityWidget
                  settings={widgetSettings}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientEdit;
