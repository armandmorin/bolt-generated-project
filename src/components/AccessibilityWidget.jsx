import React, { useState } from 'react';
import styles from '../styles/widget.module.css';

const AccessibilityWidget = ({ settings = {}, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(isPreview);

  const toggleWidget = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.widgetContainer}>
      {/* Widget Button */}
      <button 
        className={styles.widgetToggle}
        style={{
          backgroundColor: settings.buttonColor || '#2563eb',
          width: settings.buttonSize || '64px',
          height: settings.buttonSize || '64px'
        }}
        onClick={toggleWidget}
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

      {/* Widget Panel */}
      <div className={`${styles.widgetPanel} ${isOpen ? styles.open : ''}`}>
        <div 
          className={styles.widgetHeader}
          style={{
            backgroundColor: settings.headerColor || '#60a5fa',
            color: settings.headerTextColor || '#ffffff'
          }}
        >
          <h3>Accessibility Settings</h3>
        </div>

        <div className={styles.widgetBody}>
          <div className={styles.featureGrid}>
            <button className={styles.featureButton}>
              <span className={styles.featureIcon}>Aa</span>
              <span className={styles.featureText}>Readable Font</span>
            </button>
            <button className={styles.featureButton}>
              <span className={styles.featureIcon}>🎨</span>
              <span className={styles.featureText}>High Contrast</span>
            </button>
          </div>
        </div>

        <div 
          className={styles.widgetFooter}
          style={{
            color: settings.poweredByColor || '#64748b'
          }}
        >
          {settings.poweredByText || 'Accessibility Widget'}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityWidget;
