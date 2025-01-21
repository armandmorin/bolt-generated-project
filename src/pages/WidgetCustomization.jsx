import React, { useState, useEffect } from 'react';
import AccessibilityWidget from '../components/AccessibilityWidget';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState(() => {
    const savedSettings = localStorage.getItem('widgetSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      headerColor: '#60a5fa',
      headerTextColor: '#1e293b',
      buttonColor: '#2563eb',
      poweredByText: 'Powered by Our Company',
      poweredByColor: '#64748b'
    };
  });

  useEffect(() => {
    // Save settings whenever they change
    localStorage.setItem('widgetSettings', JSON.stringify(widgetSettings));
  }, [widgetSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWidgetSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('widgetSettings', JSON.stringify(widgetSettings));
    alert('Widget settings saved successfully!');
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Customization</h2>

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
          >
            Save Changes
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
