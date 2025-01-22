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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('widget_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setWidgetSettings({
          headerColor: data.header_color,
          headerTextColor: data.header_text_color,
          buttonColor: data.button_color,
          poweredByText: data.powered_by_text,
          poweredByColor: data.powered_by_color
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load settings');
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
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('widget_settings')
        .upsert({
          header_color: widgetSettings.headerColor,
          header_text_color: widgetSettings.headerTextColor,
          button_color: widgetSettings.buttonColor,
          powered_by_text: widgetSettings.poweredByText,
          powered_by_color: widgetSettings.poweredByColor,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Widget settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Customization</h2>
        {error && <div className={styles.error}>{error}</div>}

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
