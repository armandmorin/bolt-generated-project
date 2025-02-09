import * as React from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
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

  React.useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Load error:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('Loaded settings:', data[0]);
        setWidgetSettings(prev => ({
          ...prev,
          ...data[0]
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
        .select('*')
        .limit(1);

      const settingsToSave = {
        header_color: widgetSettings.header_color,
        header_text_color: widgetSettings.header_text_color,
        button_color: widgetSettings.button_color,
        powered_by_text: widgetSettings.powered_by_text,
        powered_by_color: widgetSettings.powered_by_color,
        button_size: widgetSettings.button_size,
        button_position: widgetSettings.button_position
      };

      if (existingSettings && existingSettings.length > 0) {
        const { error } = await supabase
          .from('global_widget_settings')
          .update(settingsToSave)
          .eq('id', existingSettings[0].id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('global_widget_settings')
          .insert([settingsToSave]);

        if (error) throw error;
      }

      alert('Settings saved successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save settings: ${error.message}`);
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
                    value={widgetSettings.header_color || '#ffffff'}
                    onChange={(e) => handleSettingChange('header_color', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Header Text Color</label>
                  <input
                    type="color"
                    value={widgetSettings.header_text_color || '#000000'}
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
                    value={widgetSettings.button_color || '#2563eb'}
                    onChange={(e) => handleSettingChange('button_color', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Button Size</label>
                  <select
                    value={widgetSettings.button_size || '64px'}
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
                    value={widgetSettings.button_position || 'bottom-right'}
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
                    value={widgetSettings.powered_by_text || ''}
                    onChange={(e) => handleSettingChange('powered_by_text', e.target.value)}
                    placeholder="Enter powered by text..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Powered By Text Color</label>
                  <input
                    type="color"
                    value={widgetSettings.powered_by_color || '#64748b'}
                    onChange={(e) => handleSettingChange('powered_by_color', e.target.value)}
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
    </div>
  );
}

export default WidgetCustomization;
