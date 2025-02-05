import React, { useState, useEffect } from 'react';
import AccessibilityWidget from './AccessibilityWidget';
import styles from '../styles/widgetCustomization.module.css';

function WidgetCustomization() {
  const [settings, setSettings] = useState({
    headerColor: '#60a5fa',
    headerTextColor: '#ffffff',
    buttonColor: '#2563eb',
    buttonSize: '64px',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b'
  });
  
  const [activeTab, setActiveTab] = React.useState('header');
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('widgetSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [setting]: value
      };
      // Save settings to localStorage
      localStorage.setItem('widgetSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem('widgetSettings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <form onSubmit={handleSubmit}>
          <div className={styles.settingsHeader}>
            <h2>Widget Settings</h2>
            <button 
              type="submit"
              className={`${styles.saveButton} ${saving ? styles.saving : ''}`}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'header' ? styles.active : ''}`}
              onClick={() => setActiveTab('header')}
            >
              Header
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'button' ? styles.active : ''}`}
              onClick={() => setActiveTab('button')}
            >
              Button
            </button>
            <button
              type="button"
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
                    value={settings.headerColor}
                    onChange={(e) => handleSettingChange('headerColor', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Header Text Color</label>
                  <input
                    type="color"
                    value={settings.headerTextColor}
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
                    value={settings.buttonColor}
                    onChange={(e) => handleSettingChange('buttonColor', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Button Size</label>
                  <select
                    value={settings.buttonSize}
                    onChange={(e) => handleSettingChange('buttonSize', e.target.value)}
                  >
                    <option value="48px">Small</option>
                    <option value="64px">Medium</option>
                    <option value="80px">Large</option>
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
                    value={settings.poweredByText}
                    onChange={(e) => handleSettingChange('poweredByText', e.target.value)}
                    placeholder="Enter powered by text..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Powered By Text Color</label>
                  <input
                    type="color"
                    value={settings.poweredByColor}
                    onChange={(e) => handleSettingChange('poweredByColor', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      <div className={styles.previewPanel}>
        <h2>Widget Preview</h2>
        <div className={styles.previewContainer}>
          <div className={styles.widgetPreviewWrapper}>
            <AccessibilityWidget
              settings={{
                headerColor: settings.headerColor,
                headerTextColor: settings.headerTextColor,
                buttonColor: settings.buttonColor,
                poweredByText: settings.poweredByText,
                poweredByColor: settings.poweredByColor,
                buttonSize: settings.buttonSize
              }}
              isPreview={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WidgetCustomization;
