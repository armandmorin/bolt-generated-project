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

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getGlobalSettings();
      if (settings) {
        setWidgetSettings({
          ...defaultSettings,
          ...settings,
          // Preserve local preview settings for missing columns
          button_size: settings.button_size || defaultSettings.button_size,
          button_position: settings.button_position || defaultSettings.button_position
        });
      }
    };
    loadSettings();
  }, []);

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
        // Update local state to reflect saved settings
        setWidgetSettings(prev => ({
          ...prev,
          ...widgetSettings
        }));
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.widgetCustomization}>
      {/* Rest of the component remains the same as previous implementation */}
      {/* ... */}
    </div>
  );
};

export default WidgetCustomization;
