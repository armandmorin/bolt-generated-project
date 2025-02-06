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
    header_color: '#60a5fa',
    header_text_color: '#ffffff',
    button_color: '#2563eb',
    powered_by_text: 'Powered by Accessibility Widget',
    powered_by_color: '#64748b',
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
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;

      setClient(clientData);
      
      // Load widget settings for this client
      const { data: settingsData, error: settingsError } = await supabase
        .from('widget_settings')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (!settingsError && settingsData) {
        setWidgetSettings(settingsData);
      } else {
        // Load default settings from global settings
        const { data: defaultSettings } = await supabase
          .from('global_widget_settings')
          .select('*')
          .limit(1)
          .single();

        if (defaultSettings) {
          setWidgetSettings({
            ...defaultSettings,
            client_id: clientId
          });
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
      // Update client details
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          name: client.name,
          website: client.website,
          contact_email: client.contact_email
        })
        .eq('id', clientId);

      if (clientError) throw clientError;

      // Check if widget settings exist
      const { data: existingSettings } = await supabase
        .from('widget_settings')
        .select('id')
        .eq('client_id', clientId);

      const settingsData = {
        client_id: clientId,
        header_color: widgetSettings.header_color,
        header_text_color: widgetSettings.header_text_color,
        button_color: widgetSettings.button_color,
        powered_by_text: widgetSettings.powered_by_text,
        powered_by_color: widgetSettings.powered_by_color,
        button_size: widgetSettings.button_size,
        button_position: widgetSettings.button_position
      };

      let settingsError;
      if (existingSettings?.length > 0) {
        // Update existing settings
        const { error } = await supabase
          .from('widget_settings')
          .update(settingsData)
          .eq('client_id', clientId);
        settingsError = error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('widget_settings')
          .insert([settingsData]);
        settingsError = error;
      }

      if (settingsError) throw settingsError;

      alert('Changes saved successfully');
      await loadClientData(); // Reload the data
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes: ' + error.message);
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
              <form onSubmit={handleClientUpdate}>
                <div className={styles.settingsGroup}>
                  <h3>Header Settings</h3>
                  <div className={styles.formGroup}>
                    <label>Header Background Color</label>
                    <input
                      type="color"
                      value={widgetSettings.header_color || '#60a5fa'}
                      onChange={(e) => handleSettingChange('header_color', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Header Text Color</label>
                    <input
                      type="color"
                      value={widgetSettings.header_text_color || '#ffffff'}
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
                      value={widgetSettings.button_color || '#2563eb'}
                      onChange={(e) => handleSettingChange('button_color', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Button Size</label>
                    <select
                      value={widgetSettings.button_size || '64px'}
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
                      value={widgetSettings.powered_by_text || ''}
                      onChange={(e) => handleSettingChange('powered_by_text', e.target.value)}
                      placeholder="Powered by Accessibility Widget"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Powered By Color</label>
                    <input
                      type="color"
                      value={widgetSettings.powered_by_color || '#64748b'}
                      onChange={(e) => handleSettingChange('powered_by_color', e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="submit"
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.previewPanel}>
              <h3>Widget Preview</h3>
              <div className={styles.previewContainer}>
                <AccessibilityWidget
                  settings={{
                    headerColor: widgetSettings.header_color,
                    headerTextColor: widgetSettings.header_text_color,
                    buttonColor: widgetSettings.button_color,
                    poweredByText: widgetSettings.powered_by_text,
                    poweredByColor: widgetSettings.powered_by_color,
                    buttonSize: widgetSettings.button_size,
                    buttonPosition: widgetSettings.button_position
                  }}
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
