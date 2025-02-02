import * as React from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

function WidgetCustomization() {
  const [widgetSettings, setWidgetSettings] = React.useState({
    header_color: '',
    header_text_color: '',
    button_color: '',
    powered_by_text: '',
    powered_by_color: '',
    button_size: '64px',
    button_position: 'bottom-right'
  });
  const [activeTab, setActiveTab] = React.useState('header');
  const [saving, setSaving] = React.useState(false);

  // Load settings on mount
  React.useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        console.log('Loaded settings:', data);
        setWidgetSettings(prev => ({
          ...prev,
          ...data
        }));
      }
    }

    loadSettings();
  }, []);

  const handleSettingChange = (setting, value) => {
    setWidgetSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: existingSettings } = await supabase
        .from('global_widget_settings')
        .select('id')
        .single();

      const dbSettings = {
        header_color: widgetSettings.header_color,
        header_text_color: widgetSettings.header_text_color,
        button_color: widgetSettings.button_color,
        powered_by_text: widgetSettings.powered_by_text,
        powered_by_color: widgetSettings.powered_by_color
      };

      if (existingSettings) {
        const { error } = await supabase
          .from('global_widget_settings')
          .update(dbSettings)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('global_widget_settings')
          .insert([dbSettings]);

        if (error) throw error;
      }

      alert('Settings saved successfully!');
      window.location.reload(); // Refresh to ensure we have latest data
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.widgetCustomization}>
      <div className={styles.settingsPanel}>
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
    </form>
  );
}

export default WidgetCustomization;
