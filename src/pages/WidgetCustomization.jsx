import React, { useState, useEffect } from 'react';
import { getGlobalSettings, updateGlobalSettings } from '../lib/setupGlobalSettings';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const defaultSettings = {
  header_color: '#60a5fa',
  header_text_color: '#1e293b',
  button_color: '#2563eb',
  powered_by_text: 'Powered by Accessibility Widget',
  powered_by_color: '#64748b',
  button_size: '64px',
  button_position: 'bottom-right'
};

export default function WidgetCustomization() {
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getGlobalSettings();
      if (settings) {
        setWidgetSettings(settings);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('widgetSettings', JSON.stringify(widgetSettings));
  }, [widgetSettings]);

  const handleSettingChange = (setting, value) => {
    setWidgetSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const success = await updateGlobalSettings(widgetSettings);
      if (success) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Error saving settings: ${error.message}`);
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
            {saving ? 'Saving...' : 'Save Changes'}
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

          {activeTab === 'footer' && (
            <>
              <div className={styles.formGroup}>
                <label>Powered By Text</label>
                <input
                  type="text"
                  value={widgetSettings.powered_by_text}
                  onChange={(e) => handleSettingChange('powered_by_text', e.target.value)}
                  placeholder="Powered by..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Powered By Text Color</label>
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
        <h2>Widget Preview</h2>
        <div className={styles.previewContainer}>
          <div className={styles.widgetPreviewWrapper}>
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

      <div className={styles.codeSection}>
        <h2>Installation Code</h2>
        <WidgetCodeSnippet />
      </div>
    </div>
  );
}
