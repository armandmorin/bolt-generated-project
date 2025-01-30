import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const defaultSettings = {
  // Header Settings
  headerColor: '#60a5fa',
  headerTextColor: '#1e293b',
  headerTitle: 'Accessibility Settings',
  headerLogo: '',

  // Button Settings
  buttonColor: '#2563eb',
  buttonSize: '64px',
  buttonPosition: 'bottom-right',
  buttonIcon: 'default',
  customIconUrl: '',

  // Panel Settings
  panelWidth: '320px',
  panelBackground: '#ffffff',
  panelTextColor: '#1e293b',

  // Feature Settings
  featureButtonColor: '#f8fafc',
  featureButtonActiveColor: '#e0e7ff',
  featureButtonTextColor: '#1e293b',
  featureButtonBorderColor: '#e2e8f0',
  featureIconColor: '#4b5563',

  // Footer Settings
  poweredByText: 'Powered by Our Company',
  poweredByColor: '#64748b',
  footerBackground: '#ffffff'
};

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [clientKey, setClientKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    initializeClientAndSettings();
  }, []);

  const initializeClientAndSettings = async () => {
    try {
      setLoading(true);
      // First, check if we already have a client key in localStorage
      let existingClientKey = localStorage.getItem('clientKey');
      
      if (!existingClientKey) {
        // Create a new client if we don't have one
        const newClientKey = 'client_' + Math.random().toString(36).substr(2, 9);
        
        // Insert new client
        const { error: clientError } = await supabase
          .from('clients')
          .insert([{
            client_key: newClientKey,
            name: 'Default Client',
            email: 'admin@example.com',
            status: 'active'
          }]);

        if (clientError) throw clientError;

        existingClientKey = newClientKey;
        localStorage.setItem('clientKey', newClientKey);
      }

      setClientKey(existingClientKey);

      // Get existing settings or create default ones
      const { data: settings, error: settingsError } = await supabase
        .from('widget_settings')
        .select('*')
        .eq('client_key', existingClientKey)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settings) {
        // Merge existing settings with defaults to ensure all properties exist
        setWidgetSettings({
          ...defaultSettings,
          ...settings,
          // Map database column names to state properties
          headerColor: settings.header_color || defaultSettings.headerColor,
          headerTextColor: settings.header_text_color || defaultSettings.headerTextColor,
          buttonColor: settings.button_color || defaultSettings.buttonColor,
          poweredByText: settings.powered_by_text || defaultSettings.poweredByText,
          poweredByColor: settings.powered_by_color || defaultSettings.poweredByColor
        });
      } else {
        // Create default settings for new client
        const { error: insertError } = await supabase
          .from('widget_settings')
          .insert([{
            client_key: existingClientKey,
            header_color: defaultSettings.headerColor,
            header_text_color: defaultSettings.headerTextColor,
            button_color: defaultSettings.buttonColor,
            powered_by_text: defaultSettings.poweredByText,
            powered_by_color: defaultSettings.poweredByColor
          }]);

        if (insertError) throw insertError;
        setWidgetSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error initializing client and settings:', error);
      alert('Error initializing settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWidgetSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!clientKey) {
      alert('No client key found. Please refresh the page.');
      return;
    }

    setLoading(true);
    try {
      // Map state properties to database column names
      const dbSettings = {
        client_key: clientKey,
        header_color: widgetSettings.headerColor,
        header_text_color: widgetSettings.headerTextColor,
        button_color: widgetSettings.buttonColor,
        powered_by_text: widgetSettings.poweredByText,
        powered_by_color: widgetSettings.poweredByColor,
        // Add new columns here as they're added to the database
      };

      const { error } = await supabase
        .from('widget_settings')
        .upsert(dbSettings);

      if (error) throw error;
      alert('Widget settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Customization</h2>
        
        {clientKey && (
          <div className={styles.clientKeyInfo}>
            <strong>Client Key:</strong> {clientKey}
          </div>
        )}

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'header' ? styles.active : ''}`}
            onClick={() => setActiveTab('header')}
          >
            Header
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'button' ? styles.active : ''}`}
            onClick={() => setActiveTab('button')}
          >
            Button
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'panel' ? styles.active : ''}`}
            onClick={() => setActiveTab('panel')}
          >
            Panel
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'features' ? styles.active : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'footer' ? styles.active : ''}`}
            onClick={() => setActiveTab('footer')}
          >
            Footer
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'header' && (
            <>
              <div className={styles.formGroup}>
                <label>Header Title</label>
                <input
                  type="text"
                  name="headerTitle"
                  value={widgetSettings.headerTitle || ''}
                  onChange={handleChange}
                  placeholder="Accessibility Settings"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Header Color</label>
                <input
                  type="color"
                  name="headerColor"
                  value={widgetSettings.headerColor || '#60a5fa'}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Header Text Color</label>
                <input
                  type="color"
                  name="headerTextColor"
                  value={widgetSettings.headerTextColor || '#1e293b'}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {activeTab === 'button' && (
            <>
              <div className={styles.formGroup}>
                <label>Button Color</label>
                <input
                  type="color"
                  name="buttonColor"
                  value={widgetSettings.buttonColor || '#2563eb'}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Button Size</label>
                <select
                  name="buttonSize"
                  value={widgetSettings.buttonSize || '64px'}
                  onChange={handleChange}
                >
                  <option value="48px">Small (48px)</option>
                  <option value="64px">Medium (64px)</option>
                  <option value="80px">Large (80px)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Button Position</label>
                <select
                  name="buttonPosition"
                  value={widgetSettings.buttonPosition || 'bottom-right'}
                  onChange={handleChange}
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'footer' && (
            <>
              <div className={styles.formGroup}>
                <label>Powered By Text</label>
                <input
                  type="text"
                  name="poweredByText"
                  value={widgetSettings.poweredByText || ''}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Powered By Color</label>
                <input
                  type="color"
                  name="poweredByColor"
                  value={widgetSettings.poweredByColor || '#64748b'}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={styles.previewPanel}>
        <h2>Widget Preview</h2>
        <div className={styles.widgetPreview}>
          <div className={styles.exampleContent}>
            <h3>Example Content</h3>
            <p>This is example content to demonstrate the accessibility features.</p>
            <a href="#example">Example Link</a>
          </div>
          <AccessibilityWidget settings={widgetSettings} isPreview={true} />
        </div>
      </div>

      <div className={styles.codeSection}>
        <WidgetCodeSnippet />
      </div>
    </div>
  );
};

export default WidgetCustomization;
