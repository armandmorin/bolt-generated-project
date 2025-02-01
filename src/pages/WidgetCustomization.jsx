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
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b',
    buttonSize: '64px',
    buttonPosition: 'bottom-right'
  });

  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  // Load existing settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }

      if (data) {
        setWidgetSettings(data);
        setSettingsId(data.id);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('Error loading settings. Using defaults.');
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
      let response;
      
      if (settingsId) {
        // Update existing settings
        response = await supabase
          .from('global_widget_settings')
          .update(widgetSettings)
          .eq('id', settingsId);
      } else {
        // Insert new settings
        response = await supabase
          .from('global_widget_settings')
          .insert([widgetSettings])
          .select();
      }

      if (response.error) throw response.error;

      if (response.data?.[0]?.id) {
        setSettingsId(response.data[0].id);
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
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
                  value={widgetSettings.headerColor}
                  onChange={(e) => handleSettingChange('headerColor', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Header Text Color</label>
                <input
                  type="color"
                  value={widgetSettings.headerTextColor}
                  onChange={(e) => handleSettingChange('headerTextColor', e.target.value)}
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
                  value={widgetSettings.buttonColor}
                  onChange={(e) => handleSettingChange('buttonColor', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Button Size</label>
                <select
                  value={widgetSettings.buttonSize}
                  onChange={(e) => handleSettingChange('buttonSize', e.target.value)}
                >
                  <option value="48px">Small</option>
                  <option value="64px">Medium</option>
                  <option value="80px">Large</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Button Position</label>
                <select
                  value={widgetSettings.buttonPosition}
                  onChange={(e) => handleSettingChange('buttonPosition', e.target.value)}
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
                  value={widgetSettings.poweredByText}
                  onChange={(e) => handleSettingChange('poweredByText', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Powered By Color</label>
                <input
                  type="color"
                  value={widgetSettings.poweredByColor}
                  onChange={(e) => handleSettingChange('poweredByColor', e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.previewPanel}>
        <h2>Preview</h2>
        <div className={styles.previewContainer}>
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
