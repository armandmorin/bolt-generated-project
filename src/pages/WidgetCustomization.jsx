import React, { useState } from 'react';
    import styles from '../styles/widget.module.css';

    const WidgetCustomization = () => {
      const [widgetSettings, setWidgetSettings] = useState({
        headerColor: '#2563eb',
        headerLogo: '',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Our Company',
        poweredByColor: '#666666'
      });

      const [isPreviewOpen, setIsPreviewOpen] = useState(true);
      const [activeFeatures, setActiveFeatures] = useState({
        readableFont: false,
        readAllText: false,
        clickToSpeech: false,
        fontScaling: false,
        highlightLinks: false,
        highlightTitles: false,
        highContrast: false,
        lightContrast: false,
        darkContrast: false,
        monochrome: false,
        highSaturation: false,
        lowSaturation: false,
        muteSounds: false,
        hideImages: false,
        stopAnimations: false,
        highlightHover: false,
        bigCursor: false
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setWidgetSettings(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const toggleFeature = (feature) => {
        setActiveFeatures(prev => ({
          ...prev,
          [feature]: !prev[feature]
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
                <h3>Example Content</h3>
                <p>This is example content to demonstrate the accessibility features.</p>
                <a href="#example">Example Link</a>
              </div>

              <div className={styles.widgetContainer}>
                <button 
                  className={styles.widgetToggle}
                  style={{ backgroundColor: widgetSettings.buttonColor }}
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  aria-label="Accessibility Options"
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
                  </svg>
                </button>

                {isPreviewOpen && (
                  <div className={styles.widgetPanel}>
                    <div 
                      className={styles.widgetHeader}
                      style={{ backgroundColor: widgetSettings.headerColor }}
                    >
                      {widgetSettings.headerLogo && (
                        <img 
                          src={widgetSettings.headerLogo} 
                          alt="Widget Logo" 
                          className={styles.widgetLogo}
                        />
                      )}
                      <h3>Accessibility Settings</h3>
                    </div>

                    <div className={styles.widgetBody}>
                      <div className={styles.widgetSection}>
                        <h4>Content Adjustments</h4>
                        <div className={styles.featureGrid}>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.readableFont ? styles.active : ''}`}
                            onClick={() => toggleFeature('readableFont')}
                          >
                            <span className={styles.featureIcon}>Aa</span>
                            <span>Readable Font</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.readAllText ? styles.active : ''}`}
                            onClick={() => toggleFeature('readAllText')}
                          >
                            <span className={styles.featureIcon}>▶</span>
                            <span>Read All Text</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.clickToSpeech ? styles.active : ''}`}
                            onClick={() => toggleFeature('clickToSpeech')}
                          >
                            <span className={styles.featureIcon}>🎧</span>
                            <span>Click to Speech</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.highlightLinks ? styles.active : ''}`}
                            onClick={() => toggleFeature('highlightLinks')}
                          >
                            <span className={styles.featureIcon}>🔗</span>
                            <span>Highlight Links</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.highlightTitles ? styles.active : ''}`}
                            onClick={() => toggleFeature('highlightTitles')}
                          >
                            <span className={styles.featureIcon}>H</span>
                            <span>Highlight Titles</span>
                          </button>
                        </div>
                      </div>

                      <div className={styles.widgetSection}>
                        <h4>Color Adjustments</h4>
                        <div className={styles.featureGrid}>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.highContrast ? styles.active : ''}`}
                            onClick={() => toggleFeature('highContrast')}
                          >
                            <span className={styles.featureIcon}>◐</span>
                            <span>High Contrast</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.lightContrast ? styles.active : ''}`}
                            onClick={() => toggleFeature('lightContrast')}
                          >
                            <span className={styles.featureIcon}>☀</span>
                            <span>Light Contrast</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.darkContrast ? styles.active : ''}`}
                            onClick={() => toggleFeature('darkContrast')}
                          >
                            <span className={styles.featureIcon}>🌙</span>
                            <span>Dark Contrast</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.monochrome ? styles.active : ''}`}
                            onClick={() => toggleFeature('monochrome')}
                          >
                            <span className={styles.featureIcon}>◑</span>
                            <span>Monochrome</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.highSaturation ? styles.active : ''}`}
                            onClick={() => toggleFeature('highSaturation')}
                          >
                            <span className={styles.featureIcon}>⚛</span>
                            <span>High Saturation</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.lowSaturation ? styles.active : ''}`}
                            onClick={() => toggleFeature('lowSaturation')}
                          >
                            <span className={styles.featureIcon}>💧</span>
                            <span>Low Saturation</span>
                          </button>
                        </div>
                      </div>

                      <div className={styles.widgetSection}>
                        <h4>Orientation Adjustments</h4>
                        <div className={styles.featureGrid}>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.muteSounds ? styles.active : ''}`}
                            onClick={() => toggleFeature('muteSounds')}
                          >
                            <span className={styles.featureIcon}>🔇</span>
                            <span>Mute Sounds</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.hideImages ? styles.active : ''}`}
                            onClick={() => toggleFeature('hideImages')}
                          >
                            <span className={styles.featureIcon}>🖼</span>
                            <span>Hide Images</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.stopAnimations ? styles.active : ''}`}
                            onClick={() => toggleFeature('stopAnimations')}
                          >
                            <span className={styles.featureIcon}>⏹</span>
                            <span>Stop Animations</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.highlightHover ? styles.active : ''}`}
                            onClick={() => toggleFeature('highlightHover')}
                          >
                            <span className={styles.featureIcon}>🖱</span>
                            <span>Highlight Hover</span>
                          </button>
                          <button
                            className={`${styles.featureButton} ${activeFeatures.bigCursor ? styles.active : ''}`}
                            onClick={() => toggleFeature('bigCursor')}
                          >
                            <span className={styles.featureIcon}>➜</span>
                            <span>Big Cursor</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={styles.widgetFooter}
                      style={{ color: widgetSettings.poweredByColor }}
                    >
                      {widgetSettings.poweredByText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default WidgetCustomization;
