import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
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

      if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw settingsError;
      }

      if (settings) {
        // Update state with existing settings
        setWidgetSettings({
          headerColor: settings.header_color,
          headerTextColor: settings.header_text_color,
          buttonColor: settings.button_color,
          poweredByText: settings.powered_by_text,
          poweredByColor: settings.powered_by_color
        });
      } else {
        // Create default settings for new client
        const { error: insertError } = await supabase
          .from('widget_settings')
          .insert([{
            client_key: existingClientKey,
            header_color: widgetSettings.headerColor,
            header_text_color: widgetSettings.headerTextColor,
            button_color: widgetSettings.buttonColor,
            powered_by_text: widgetSettings.poweredByText,
            powered_by_color: widgetSettings.poweredByColor
          }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error initializing client and settings:', error);
      alert('Error initializing settings. Please try again.');
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
      // Update settings in Supabase
      const { error } = await supabase
        .from('widget_settings')
        .upsert({
          client_key: clientKey,
          header_color: widgetSettings.headerColor,
          header_text_color: widgetSettings.headerTextColor,
          button_color: widgetSettings.buttonColor,
          powered_by_text: widgetSettings.poweredByText,
          powered_by_color: widgetSettings.poweredByColor
        });

      if (error) throw error;

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
        {clientKey && (
          <div className={styles.clientKey}>
            <strong>Your Client Key:</strong> {clientKey}
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Header Color</label>
          <input
            type="color"
            name="headerColor"
            value={widgetSettings.headerColor}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Header Text Color</label>
          <input
            type="color"
            name="headerTextColor"
            value={widgetSettings.headerTextColor}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Button Color</label>
          <input
            type="color"
            name="buttonColor"
            value={widgetSettings.buttonColor}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Powered By Text</label>
          <input
            type="text"
            name="poweredByText"
            value={widgetSettings.poweredByText}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Powered By Color</label>
          <input
            type="color"
            name="poweredByColor"
            value={widgetSettings.poweredByColor}
            onChange={handleChange}
          />
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
            <p>This is example content to demonstrate the accessibility features. Try clicking the accessibility button to see the widget in action.</p>
            <a href="#example">Example Link</a>
          </div>
          <AccessibilityWidget settings={widgetSettings} isPreview={true} />
        </div>
      </div>
    </div>
  );
};

export default WidgetCustomization;
