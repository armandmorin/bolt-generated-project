import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState({
    // Header Settings
    headerColor: '#60a5fa',
    headerTextColor: '#1e293b',
    headerLogo: '',
    headerTitle: 'Accessibility Settings',

    // Button Settings
    buttonColor: '#2563eb',
    buttonSize: '64px',
    buttonPosition: 'bottom-right',
    buttonIcon: 'default', // 'default', 'wheelchair', 'custom'
    customIconUrl: '',

    // Panel Settings
    panelWidth: '320px',
    panelBackground: '#ffffff',
    panelTextColor: '#1e293b',

    // Feature Settings
    featureButtonColor: '#f8fafc',
    featureButtonActiveColor: '#e0e7ff',
    featureButtonTextColor: '#1e293b',
    featureButtonBorderColor: '#e2e8f0',
    featureIconColor: '#4b5563',

    // Footer Settings
    poweredByText: 'Powered by Our Company',
    poweredByColor: '#64748b',
    footerBackground: '#ffffff'
  });

  const [clientKey, setClientKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  // ... existing useEffect and initialization code ...

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWidgetSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Customization</h2>
        
        {clientKey && (
          <div className={styles.clientKeyInfo}>
            <strong>Client Key:</strong> {clientKey}
          </div>
        )}

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
            className={`${styles.tab} ${activeTab === 'panel' ? styles.active : ''}`}
            onClick={() => setActiveTab('panel')}
          >
            Panel
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'features' ? styles.active : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
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

              <div className={styles.formGroup}>
                <label>Header Logo URL (optional)</label>
                <input
                  type="url"
                  name="headerLogo"
                  value={widgetSettings.headerLogo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
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

              <div className={styles.formGroup}>
                <label>Button Icon</label>
                <select
                  name="buttonIcon"
                  value={widgetSettings.buttonIcon}
                  onChange={handleChange}
                >
                  <option value="default">Default Icon</option>
                  <option value="wheelchair">Wheelchair Icon</option>
                  <option value="custom">Custom Icon</option>
                </select>
              </div>

              {widgetSettings.buttonIcon === 'custom' && (
                <div className={styles.formGroup}>
                  <label>Custom Icon URL</label>
                  <input
                    type="url"
                    name="customIconUrl"
                    value={widgetSettings.customIconUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/icon.svg"
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'panel' && (
            <>
              <div className={styles.formGroup}>
                <label>Panel Width</label>
                <select
                  name="panelWidth"
                  value={widgetSettings.panelWidth}
                  onChange={handleChange}
                >
                  <option value="280px">Narrow (280px)</option>
                  <option value="320px">Standard (320px)</option>
                  <option value="360px">Wide (360px)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Panel Background Color</label>
                <input
                  type="color"
                  name="panelBackground"
                  value={widgetSettings.panelBackground}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Panel Text Color</label>
                <input
                  type="color"
                  name="panelTextColor"
                  value={widgetSettings.panelTextColor}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {activeTab === 'features' && (
            <>
              <div className={styles.formGroup}>
                <label>Feature Button Color</label>
                <input
                  type="color"
                  name="featureButtonColor"
                  value={widgetSettings.featureButtonColor}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Feature Button Active Color</label>
                <input
                  type="color"
                  name="featureButtonActiveColor"
                  value={widgetSettings.featureButtonActiveColor}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Feature Button Text Color</label>
                <input
                  type="color"
                  name="featureButtonTextColor"
                  value={widgetSettings.featureButtonTextColor}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Feature Button Border Color</label>
                <input
                  type="color"
                  name="featureButtonBorderColor"
                  value={widgetSettings.featureButtonBorderColor}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Feature Icon Color</label>
                <input
                  type="color"
                  name="featureIconColor"
                  value={widgetSettings.featureIconColor}
                  onChange={handleChange}
                />
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

              <div className={styles.formGroup}>
                <label>Footer Background Color</label>
                <input
                  type="color"
                  name="footerBackground"
                  value={widgetSettings.footerBackground}
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
        <div className={styles.widgetPreview}>
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
