import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState({
    headerColor: '#60a5fa',
    headerTextColor: '#1e293b',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Our Company',
    poweredByColor: '#64748b'
  });

  const [clientKey, setClientKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeClientAndSettings();
  }, []);

  const initializeClientAndSettings = async () => {
    try {
      // First, check if we already have a client key in localStorage
      let existingClientKey = localStorage.getItem('clientKey');
      
      if (!existingClientKey) {
        // Create a new client if we don't have one
        const newClientKey = 'client_' + Math.random().toString(36).substr(2, 9);
        
        // Insert new client into clients table
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .insert([{
            client_key: newClientKey,
            name: 'Default Client',
            email: 'admin@example.com',
            status: 'active'
          }])
          .select()
          .single();

        if (clientError) throw clientError;

        console.log('Created new client:', clientData); // Debug log

        existingClientKey = newClientKey;
        localStorage.setItem('clientKey', newClientKey);
      }

      setClientKey(existingClientKey);

      // Verify client exists in database
      const { data: clientData, error: clientCheckError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_key', existingClientKey)
        .single();

      if (clientCheckError || !clientData) {
        throw new Error('Client not found in database');
      }

      console.log('Found client in database:', clientData); // Debug log

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
        console.log('Found existing settings:', settings); // Debug log
        setWidgetSettings({
          headerColor: settings.header_color,
          headerTextColor: settings.header_text_color,
          buttonColor: settings.button_color,
          poweredByText: settings.powered_by_text,
          poweredByColor: settings.powered_by_color
        });
      } else {
        // Create default settings for new client
        const { data: newSettings, error: insertError } = await supabase
          .from('widget_settings')
          .insert([{
            client_key: existingClientKey,
            header_color: widgetSettings.headerColor,
            header_text_color: widgetSettings.headerTextColor,
            button_color: widgetSettings.buttonColor,
            powered_by_text: widgetSettings.poweredByText,
            powered_by_color: widgetSettings.poweredByColor
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        console.log('Created new settings:', newSettings); // Debug log
      }
    } catch (error) {
      console.error('Error initializing client and settings:', error);
      alert('Error initializing settings. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!clientKey) {
      alert('No client key found. Please refresh the page.');
      return;
    }

    setLoading(true);
    try {
      // Verify client exists before saving settings
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_key', clientKey)
        .single();

      if (clientError || !clientData) {
        throw new Error('Client not found in database');
      }

      // Update settings in Supabase
      const { data: updatedSettings, error } = await supabase
        .from('widget_settings')
        .upsert({
          client_key: clientKey,
          header_color: widgetSettings.headerColor,
          header_text_color: widgetSettings.headerTextColor,
          button_color: widgetSettings.buttonColor,
          powered_by_text: widgetSettings.poweredByText,
          powered_by_color: widgetSettings.poweredByColor
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Updated settings:', updatedSettings); // Debug log
      alert('Widget settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Customization</h2>
        
        {/* Display current client key */}
        {clientKey && (
          <div className={styles.clientKeyInfo}>
            <p><strong>Client Key:</strong> {clientKey}</p>
            <p><small>This key is used to identify your widget settings.</small></p>
          </div>
        )}

        {/* Settings form */}
        <div className={styles.formGroup}>
          <label>Header Color</label>
          <input
            type="color"
            name="headerColor"
            value={widgetSettings.headerColor}
            onChange={(e) => setWidgetSettings(prev => ({
              ...prev,
              headerColor: e.target.value
            }))}
          />
        </div>

        {/* ... rest of your form fields ... */}

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

      <div className={styles.codeSection}>
        <WidgetCodeSnippet />
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
    </div>
  );
};

export default WidgetCustomization;
