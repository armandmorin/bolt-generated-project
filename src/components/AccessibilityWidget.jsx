import React, { useState } from 'react';
    import styles from '../styles/widget.module.css';

    const AccessibilityWidget = ({ settings, isPreview = false }) => {
      const [isOpen, setIsOpen] = useState(isPreview);
      const [features, setFeatures] = useState({
        // Content Adjustments
        readableFont: false,
        readAllText: false,
        clickToSpeech: false,
        fontScaling: false,
        highlightLinks: false,
        highlightTitles: false,

        // Color Adjustments
        highContrast: false,
        lightContrast: false,
        darkContrast: false,
        monochrome: false,
        highSaturation: false,
        lowSaturation: false,

        // Orientation Adjustments
        muteSounds: false,
        hideImages: false,
        stopAnimations: false,
        highlightHover: false,
        bigCursor: false
      });

      const toggleFeature = (feature) => {
        setFeatures(prev => ({
          ...prev,
          [feature]: !prev[feature]
        }));
      };

      const applyFeatures = () => {
        // Apply the features here
        // This is where you would implement the actual accessibility changes
      };

      return (
        <div className={styles.widgetContainer}>
          <button 
            className={styles.widgetToggle}
            style={{ backgroundColor: settings.buttonColor }}
            onClick={() => setIsOpen(!isOpen)}
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

          {isOpen && (
            <div className={styles.widgetPanel}>
              <div 
                className={styles.widgetHeader}
                style={{ backgroundColor: settings.headerColor }}
              >
                {settings.headerLogo && (
                  <img 
                    src={settings.headerLogo} 
                    alt="Accessibility Logo" 
                    className={styles.widgetLogo}
                  />
                )}
                <h3>Accessibility Settings</h3>
              </div>

              <div className={styles.widgetBody}>
                {/* Content Adjustments */}
                <div className={styles.widgetSection}>
                  <h4>Content Adjustments</h4>
                  <div className={styles.featureGrid}>
                    <button
                      className={`${styles.featureButton} ${features.readableFont ? styles.active : ''}`}
                      onClick={() => toggleFeature('readableFont')}
                    >
                      <span className={styles.featureIcon}>Aa</span>
                      <span>Readable Font</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.readAllText ? styles.active : ''}`}
                      onClick={() => toggleFeature('readAllText')}
                    >
                      <span className={styles.featureIcon}>▶</span>
                      <span>Read All Text</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.clickToSpeech ? styles.active : ''}`}
                      onClick={() => toggleFeature('clickToSpeech')}
                    >
                      <span className={styles.featureIcon}>🎧</span>
                      <span>Turn on Click to Speech</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.fontScaling ? styles.active : ''}`}
                      onClick={() => toggleFeature('fontScaling')}
                    >
                      <span className={styles.featureIcon}>T↕</span>
                      <span>Font Scaling</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.highlightLinks ? styles.active : ''}`}
                      onClick={() => toggleFeature('highlightLinks')}
                    >
                      <span className={styles.featureIcon}>🔗</span>
                      <span>Highlight Links</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.highlightTitles ? styles.active : ''}`}
                      onClick={() => toggleFeature('highlightTitles')}
                    >
                      <span className={styles.featureIcon}>H</span>
                      <span>Highlight Titles</span>
                    </button>
                  </div>
                </div>

                {/* Color Adjustments */}
                <div className={styles.widgetSection}>
                  <h4>Color Adjustments</h4>
                  <div className={styles.featureGrid}>
                    <button
                      className={`${styles.featureButton} ${features.highContrast ? styles.active : ''}`}
                      onClick={() => toggleFeature('highContrast')}
                    >
                      <span className={styles.featureIcon}>◐</span>
                      <span>High Contrast</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.lightContrast ? styles.active : ''}`}
                      onClick={() => toggleFeature('lightContrast')}
                    >
                      <span className={styles.featureIcon}>☀</span>
                      <span>Light Contrast</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.darkContrast ? styles.active : ''}`}
                      onClick={() => toggleFeature('darkContrast')}
                    >
                      <span className={styles.featureIcon}>🌙</span>
                      <span>Dark Contrast</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.monochrome ? styles.active : ''}`}
                      onClick={() => toggleFeature('monochrome')}
                    >
                      <span className={styles.featureIcon}>◑</span>
                      <span>Monochrome</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.highSaturation ? styles.active : ''}`}
                      onClick={() => toggleFeature('highSaturation')}
                    >
                      <span className={styles.featureIcon}>⚛</span>
                      <span>High Saturation</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.lowSaturation ? styles.active : ''}`}
                      onClick={() => toggleFeature('lowSaturation')}
                    >
                      <span className={styles.featureIcon}>💧</span>
                      <span>Low Saturation</span>
                    </button>
                  </div>
                </div>

                {/* Orientation Adjustments */}
                <div className={styles.widgetSection}>
                  <h4>Orientation Adjustments</h4>
                  <div className={styles.featureGrid}>
                    <button
                      className={`${styles.featureButton} ${features.muteSounds ? styles.active : ''}`}
                      onClick={() => toggleFeature('muteSounds')}
                    >
                      <span className={styles.featureIcon}>🔇</span>
                      <span>Mute Sounds</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.hideImages ? styles.active : ''}`}
                      onClick={() => toggleFeature('hideImages')}
                    >
                      <span className={styles.featureIcon}>🖼</span>
                      <span>Hide Images</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.stopAnimations ? styles.active : ''}`}
                      onClick={() => toggleFeature('stopAnimations')}
                    >
                      <span className={styles.featureIcon}>⛔</span>
                      <span>Stop Animations</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.highlightHover ? styles.active : ''}`}
                      onClick={() => toggleFeature('highlightHover')}
                    >
                      <span className={styles.featureIcon}>🖱</span>
                      <span>Highlight Hover</span>
                    </button>
                    <button
                      className={`${styles.featureButton} ${features.bigCursor ? styles.active : ''}`}
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
                style={{ color: settings.poweredByColor }}
              >
                {settings.poweredByText}
              </div>
            </div>
          )}
        </div>
      );
    };

    export default AccessibilityWidget;
