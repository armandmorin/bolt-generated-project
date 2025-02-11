import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
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

function WidgetCustomization() {
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error('Error loading widget settings:', error);
        return;
      }
      if (data) {
        setWidgetSettings({ ...defaultSettings, ...data });
      } else {
        setWidgetSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Error loading widget settings:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    setWidgetSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upsert global widget settings record
      const { error } = await supabase
        .from('global_widget_settings')
        .upsert(widgetSettings, { onConflict: 'id' });
      if (error) throw error;
      setMessage('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving widget settings:', error);
      setMessage('Error saving widget settings');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
        <h2>Widget Settings</h2>
        <form onSubmit={handleSave}>
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
          <div className={styles.formGroup}>
            <label>Button Color</label>
            <input
              type="color"
              value={widgetSettings.button_color}
              onChange={(e) => handleSettingChange('button_color', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Powered By Text</label>
            <input
              type="text"
              value={widgetSettings.powered_by_text}
              onChange={(e) => handleSettingChange('powered_by_text', e.target.value)}
              placeholder="Enter powered by text"
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
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {message && <div className={styles.message}>{message}</div>}
        </form>
      </div>

      <div className={styles.previewPanel}>
        <h2>Widget Preview</h2>
        <div className={styles.previewContainer}>
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
  );
}

export default WidgetCustomization;
