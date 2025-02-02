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
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    loadSettings();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('global_widget_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_widget_settings'
        },
        (payload) => {
          if (payload.new) {
            setWidgetSettings(payload.new);
            setSettingsId(payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const loadSettings = async () => {
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
          header_color: data.header_color || '#60a5fa',
          header_text_color: data.header_text_color || '#1e293b',
          button_color: data.button_color || '#2563eb',
          powered_by_text: data.powered_by_text || 'Powered by Accessibility Widget',
          powered_by_color: data.powered_by_color || '#64748b',
          button_size: widgetSettings.button_size,
          button_position: widgetSettings.button_position
        });
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
      // Exclude the 'button_size' and 'button_position' columns since they are missing
      const settingsData = {
        header_color: widgetSettings.header_color,
        header_text_color: widgetSettings.header_text_color,
        button_color: widgetSettings.button_color,
        powered_by_text: widgetSettings.powered_by_text,
        powered_by_color: widgetSettings.powered_by_color
      };

      let response;
      if (settingsId) {
        response = await supabase
          .from('global_widget_settings')
          .update(settingsData)
          .eq('id', settingsId);
      } else {
        response = await supabase
          .from('global_widget_settings')
          .insert([settingsData])
          .select()
          .single();
        if (!response.error) {
          setSettingsId(response.data.id);
        }
      }

      if (response.error) throw response.error;      
      localStorage.setItem('widgetPreview', JSON.stringify(widgetSettings));
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
                  <option value="48px">Small (48px)</option>
                  <option value="64px">Medium (64px)</option>
                  <option value="80px">Large (80px)</option>
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
            <AccessibilityWidget settings={widgetSettings} isPreview={true} />
          </div>
          <div className={styles.previewPlaceholder}>
            This is a preview of how the widget will appear on your website. 
            The widget is fully functional in this preview.
          </div>
        </div>
      </div>

      <div className={styles.codeSection}>
        <WidgetCodeSnippet />
      </div>
    </div>
  );
};

export default WidgetCustomization;
