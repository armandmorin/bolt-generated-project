import React, { useState } from 'react';
import AccessibilityWidget from '../components/AccessibilityWidget';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState(() => {
    const savedSettings = localStorage.getItem('widgetSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      headerColor: '#2563eb',
      headerLogo: '',
      buttonColor: '#2563eb',
      poweredByText: 'Powered by Our Company',
      poweredByColor: '#666666',
      version: 1 // Add version control
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWidgetSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Increment version number
      const updatedSettings = {
        ...widgetSettings,
        version: (widgetSettings.version || 0) + 1
      };

      // Save to localStorage
      localStorage.setItem('widgetSettings', JSON.stringify(updatedSettings));

      // Update settings in database (this would be your API endpoint)
      const response = await fetch('/api/widget-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setWidgetSettings(updatedSettings);
      alert('Widget settings saved successfully! All client widgets will be updated automatically.');
    } catch (error) {
      console.error('Error saving widget settings:', error);
      alert('Failed to save widget settings. Please try again.');
    }
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Customization</h2>
        <p className={styles.versionInfo}>Current Version: {widgetSettings.version || 1}</p>

        {/* ... rest of the form fields ... */}

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

      {/* ... rest of the component ... */}
    </div>
  );
};

export default WidgetCustomization;
