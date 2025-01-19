import React, { useState } from 'react';
    import AccessibilityWidget from '../components/AccessibilityWidget';
    import styles from '../styles/widgetCustomization.module.css';

    const WidgetCustomization = () => {
      const [widgetSettings, setWidgetSettings] = useState({
        headerColor: '#2563eb',
        headerLogo: '',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Our Company',
        poweredByColor: '#666666'
      });

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
              <label>Header Logo URL</label>
              <input
                type="url"
                name="headerLogo"
                value={widgetSettings.headerLogo}
                onChange={handleChange}
                placeholder="Enter logo URL"
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
          </div>

          <div className={styles.previewPanel}>
            <h2>Widget Preview</h2>
            <div className={styles.widgetPreview}>
              <div className={styles.exampleContent}>
                <h3>Example Website Content</h3>
                <p>
                  This is an example of how your website content might look. The accessibility widget
                  will help users customize their viewing experience. Try clicking the accessibility
                  icon in the bottom right corner to see how it works.
                </p>
                <p>
                  <a href="#example">This is an example link</a> that can be highlighted using the
                  accessibility features.
                </p>
              </div>
              <AccessibilityWidget settings={widgetSettings} isPreview={true} />
            </div>
          </div>
        </div>
      );
    };

    export default WidgetCustomization;
