import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
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

  // Footer Settings
  poweredByText: 'Powered by Our Company',
  poweredByColor: '#64748b',
  footerBackground: '#ffffff'
};

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: settings, error } = await supabase
        .from('widget_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (settings) {
        setWidgetSettings({
          ...defaultSettings,
          ...settings,
          headerColor: settings.header_color || defaultSettings.headerColor,
          headerTextColor: settings.header_text_color || defaultSettings.headerTextColor,
          buttonColor: settings.button_color || defaultSettings.buttonColor,
          poweredByText: settings.powered_by_text || defaultSettings.poweredByText,
          poweredByColor: settings.powered_by_color || defaultSettings.poweredByColor
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('Error loading settings. Please try again.');
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
    setLoading(true);
    try {
      const dbSettings = {
        header_color: widgetSettings.headerColor,
        header_text_color: widgetSettings.headerTextColor,
        button_color: widgetSettings.buttonColor,
        powered_by_text: widgetSettings.poweredByText,
        powered_by_color: widgetSettings.poweredByColor,
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
                  value={widgetSettings.headerTitle}
                  onChange={handleChange}
                  placeholder="Accessibility Settings"
                />
              </div>

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
            </>
          )}

          {activeTab === 'button' && (
            <>
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
                <label>Button Size</label>
                <select
                  name="buttonSize"
                  value={widgetSettings.buttonSize}
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
                  value={widgetSettings.buttonPosition}
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
            </>
          )}
        </div>

        <button 
          className={styles.saveButton}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
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
