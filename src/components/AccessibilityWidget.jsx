import React, { useState } from 'react';
import styles from '../styles/widget.module.css';

const AccessibilityWidget = ({ settings, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(isPreview);
  const [features, setFeatures] = useState({
    readableFont: false,
    fontScaling: false,
    highlightLinks: false,
    highlightTitles: false,
    highContrast: false,
    lightContrast: false,
    darkContrast: false,
    monochrome: false,
    hideImages: false,
    stopAnimations: false
  });

  const toggleFeature = (feature) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
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
            style={{ 
              backgroundColor: settings.headerColor
            }}
          >
            <h3 style={{ color: settings.headerTextColor }}>
              {settings.headerTitle || 'Accessibility Settings'}
            </h3>
          </div>

          <div className={styles.widgetBody}>
            <div className={styles.widgetSection}>
              <h4>Content Adjustments</h4>
              <div className={styles.featureGrid}>
                <button
                  className={`${styles.featureButton} ${features.readableFont ? styles.active : ''}`}
                  onClick={() => toggleFeature('readableFont')}
                >
                  <span className={styles.featureIcon}>Aa</span>
                  <span className={styles.featureText}>Readable Font</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.fontScaling ? styles.active : ''}`}
                  onClick={() => toggleFeature('fontScaling')}
                >
                  <span className={styles.featureIcon}>T↕</span>
                  <span className={styles.featureText}>Font Scaling</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.highlightLinks ? styles.active : ''}`}
                  onClick={() => toggleFeature('highlightLinks')}
                >
                  <span className={styles.featureIcon}>🔗</span>
                  <span className={styles.featureText}>Highlight Links</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.highlightTitles ? styles.active : ''}`}
                  onClick={() => toggleFeature('highlightTitles')}
                >
                  <span className={styles.featureIcon}>H</span>
                  <span className={styles.featureText}>Highlight Titles</span>
                </button>
              </div>
            </div>

            <div className={styles.widgetSection}>
              <h4>Color Adjustments</h4>
              <div className={styles.featureGrid}>
                <button
                  className={`${styles.featureButton} ${features.highContrast ? styles.active : ''}`}
                  onClick={() => toggleFeature('highContrast')}
                >
                  <span className={styles.featureIcon}>◐</span>
                  <span className={styles.featureText}>High Contrast</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.lightContrast ? styles.active : ''}`}
                  onClick={() => toggleFeature('lightContrast')}
                >
                  <span className={styles.featureIcon}>☀</span>
                  <span className={styles.featureText}>Light Contrast</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.darkContrast ? styles.active : ''}`}
                  onClick={() => toggleFeature('darkContrast')}
                >
                  <span className={styles.featureIcon}>🌙</span>
                  <span className={styles.featureText}>Dark Contrast</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.monochrome ? styles.active : ''}`}
                  onClick={() => toggleFeature('monochrome')}
                >
                  <span className={styles.featureIcon}>◑</span>
                  <span className={styles.featureText}>Monochrome</span>
                </button>
              </div>
            </div>

            <div className={styles.widgetSection}>
              <h4>Orientation Adjustments</h4>
              <div className={styles.featureGrid}>
                <button
                  className={`${styles.featureButton} ${features.hideImages ? styles.active : ''}`}
                  onClick={() => toggleFeature('hideImages')}
                >
                  <span className={styles.featureIcon}>🖼</span>
                  <span className={styles.featureText}>Hide Images</span>
                </button>
                <button
                  className={`${styles.featureButton} ${features.stopAnimations ? styles.active : ''}`}
                  onClick={() => toggleFeature('stopAnimations')}
                >
                  <span className={styles.featureIcon}>⛔</span>
                  <span className={styles.featureText}>Stop Animations</span>
                </button>
              </div>
            </div>
          </div>

          <div 
            className={styles.widgetFooter}
            style={{ color: settings.poweredByColor }}
          >
            {settings.poweredByText || 'Powered by Accessibility Widget'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
