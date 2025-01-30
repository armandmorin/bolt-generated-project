import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState({
    header_color: '#60a5fa',
    header_text_color: '#1e293b',
    button_color: '#2563eb',
    powered_by_text: 'Powered by Accessibility Widget',
    powered_by_color: '#64748b'
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Get the global settings
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error) {
        console.warn('Error loading settings:', error);
        return; // Keep using default settings
      }

      if (data) {
        setWidgetSettings(data);
      }
    } catch (error) {
      console.error('Error:', error);
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
    try {
      setLoading(true);

      // Update global settings
      const { error } = await supabase
        .from('global_widget_settings')
        .upsert(widgetSettings);

      if (error) throw error;

      alert('Settings saved successfully!');
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
                <label>Header Color</label>
                <input
                  type="color"
                  name="header_color"
                  value={widgetSettings.header_color}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Header Text Color</label>
                <input
                  type="color"
                  name="header_text_color"
                  value={widgetSettings.header_text_color}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {activeTab === 'button' && (
            <div className={styles.formGroup}>
              <label>Button Color</label>
              <input
                type="color"
                name="button_color"
                value={widgetSettings.button_color}
                onChange={handleChange}
              />
            </div>
          )}

          {activeTab === 'footer' && (
            <>
              <div className={styles.formGroup}>
                <label>Powered By Text</label>
                <input
                  type="text"
                  name="powered_by_text"
                  value={widgetSettings.powered_by_text}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Powered By Color</label>
                <input
                  type="color"
                  name="powered_by_color"
                  value={widgetSettings.powered_by_color}
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
        <div className={styles.previewContainer}>
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
