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
    powered_by_color: '#64748b',
    button_size: '64px',
    button_position: 'bottom-right'
  });

  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGlobalSettings();
  }, []);

  const loadGlobalSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setWidgetSettings({
          header_color: data.header_color,
          header_text_color: data.header_text_color,
          button_color: data.button_color,
          powered_by_text: data.powered_by_text,
          powered_by_color: data.powered_by_color,
          button_size: data.button_size,
          button_position: data.button_position
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = (setting, value) => {
    setWidgetSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // First, check if settings exist
      const { data: existingSettings } = await supabase
        .from('global_widget_settings')
        .select('id')
        .single();

      let response;
      if (existingSettings) {
        // Update existing settings
        response = await supabase
          .from('global_widget_settings')
          .update({
            header_color: widgetSettings.header_color,
            header_text_color: widgetSettings.header_text_color,
            button_color: widgetSettings.button_color,
            powered_by_text: widgetSettings.powered_by_text,
            powered_by_color: widgetSettings.powered_by_color,
            button_size: widgetSettings.button_size,
            button_position: widgetSettings.button_position,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);
      } else {
        // Insert new settings
        response = await supabase
          .from('global_widget_settings')
          .insert([{
            header_color: widgetSettings.header_color,
            header_text_color: widgetSettings.header_text_color,
            button_color: widgetSettings.button_color,
            powered_by_text: widgetSettings.powered_by_text,
            powered_by_color: widgetSettings.powered_by_color,
            button_size: widgetSettings.button_size,
            button_position: widgetSettings.button_position
          }]);
      }

      if (response.error) {
        throw response.error;
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Convert settings for the preview component
  const previewSettings = {
    headerColor: widgetSettings.header_color,
    headerTextColor: widgetSettings.header_text_color,
    buttonColor: widgetSettings.button_color,
    poweredByText: widgetSettings.powered_by_text,
    poweredByColor: widgetSettings.powered_by_color,
    buttonSize: widgetSettings.button_size,
    buttonPosition: widgetSettings.button_position
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <div className={styles.settingsHeader}>
          <h2>Widget Settings</h2>
          <button 
            className={`${styles.saveButton} ${saving ? styles.saving : ''}`}
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

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
            className={`${styles.tab} ${activeTab === 'branding' ? styles.active : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            Branding
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'header' && (
            <>
              <div className={styles.formGroup}>
                <label>Header Color</label>
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
            </>
          )}

          {activeTab === 'button' && (
            <>
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
              <div className={styles.formGroup}>
                <label>Button Position</label>
                <select
                  value={widgetSettings.button_position}
                  onChange={(e) => handleSettingChange('button_position', e.target.value)}
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'branding' && (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className={styles.previewPanel}>
        <h2>Preview</h2>
        <div className={styles.previewContainer}>
          <AccessibilityWidget settings={previewSettings} isPreview={true} />
        </div>
      </div>

      <div className={styles.codeSection}>
        <WidgetCodeSnippet />
      </div>
    </div>
  );
};

export default WidgetCustomization;
