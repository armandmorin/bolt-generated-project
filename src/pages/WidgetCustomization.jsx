import React, { useState, useEffect } from 'react';
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
  const [saved, setSaved] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('widgetSettings');
    if (savedSettings) {
      setWidgetSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (setting, value) => {
    setWidgetSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setSaved(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('widgetSettings', JSON.stringify(widgetSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <div className={styles.settingsHeader}>
          <h2>Widget Settings</h2>
          <button 
            className={`${styles.saveButton} ${saved ? styles.saved : ''}`}
            onClick={handleSaveSettings}
          >
            {saved ? 'Saved!' : 'Save Settings'}
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
