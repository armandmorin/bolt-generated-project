import React, { useState } from 'react';
import styles from '../styles/widget.module.css';

const AccessibilityWidget = ({ settings = {}, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(isPreview);
  const [features, setFeatures] = useState({
    readableFont: false,
    highContrast: false,
    largeText: false,
    highlightLinks: false,
    textToSpeech: false,
    dyslexiaFont: false,
    cursorHighlight: false,
    invertColors: false,
    reducedMotion: false,
    focusMode: false,
    readingGuide: false,
    monochrome: false
  });

  const toggleWidget = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleFeatureToggle = (feature) => {
    setFeatures(prev => {
      const newFeatures = { ...prev, [feature]: !prev[feature] };
      applyFeatures(newFeatures);
      return newFeatures;
    });
  };

  const applyFeatures = (activeFeatures) => {
    // Readable Font
    if (activeFeatures.readableFont) {
      document.body.style.fontFamily = 'Arial, sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }

    // High Contrast
    if (activeFeatures.highContrast) {
      document.body.style.filter = 'contrast(150%)';
    } else {
      document.body.style.filter = '';
    }

    // Large Text
    if (activeFeatures.largeText) {
      document.body.style.fontSize = '120%';
    } else {
      document.body.style.fontSize = '';
    }

    // Highlight Links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (activeFeatures.highlightLinks) {
        link.style.backgroundColor = '#ffeb3b';
        link.style.color = '#000000';
      } else {
        link.style.backgroundColor = '';
        link.style.color = '';
      }
    });

    // Text to Speech
    if (activeFeatures.textToSpeech) {
      document.addEventListener('click', handleTextToSpeech);
    } else {
      document.removeEventListener('click', handleTextToSpeech);
      window.speechSynthesis?.cancel();
    }

    // Dyslexia Font
    if (activeFeatures.dyslexiaFont) {
      document.body.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
    }

    // Cursor Highlight
    if (activeFeatures.cursorHighlight) {
      document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%23ffeb3b\' opacity=\'0.5\'/%3E%3C/svg%3E") 16 16, auto';
    } else {
      document.body.style.cursor = '';
    }

    // Invert Colors
    if (activeFeatures.invertColors) {
      document.body.style.filter = 'invert(100%)';
    }

    // Reduced Motion
    if (activeFeatures.reducedMotion) {
      document.body.style.setProperty('--reduced-motion', 'reduce');
    } else {
      document.body.style.setProperty('--reduced-motion', 'no-preference');
    }

    // Focus Mode
    if (activeFeatures.focusMode) {
      document.body.style.maxWidth = '800px';
      document.body.style.margin = '0 auto';
      document.body.style.padding = '20px';
      document.body.style.backgroundColor = '#f8f9fa';
    }

    // Reading Guide
    if (activeFeatures.readingGuide) {
      const guide = document.createElement('div');
      guide.id = 'reading-guide';
      guide.style.position = 'fixed';
      guide.style.height = '40px';
      guide.style.width = '100%';
      guide.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      guide.style.pointerEvents = 'none';
      guide.style.zIndex = '9999';
      document.body.appendChild(guide);
      document.addEventListener('mousemove', moveReadingGuide);
    } else {
      document.getElementById('reading-guide')?.remove();
      document.removeEventListener('mousemove', moveReadingGuide);
    }

    // Monochrome
    if (activeFeatures.monochrome) {
      document.body.style.filter = 'grayscale(100%)';
    }
  };

  const handleTextToSpeech = (e) => {
    if (e.target.textContent && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(e.target.textContent);
      window.speechSynthesis.speak(utterance);
    }
  };

  const moveReadingGuide = (e) => {
    const guide = document.getElementById('reading-guide');
    if (guide) {
      guide.style.top = `${e.clientY - 20}px`;
    }
  };

  return (
    <div className={styles.widgetContainer}>
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
            {Object.entries(features).map(([feature, isActive]) => (
              <button
                key={feature}
                className={`${styles.featureButton} ${isActive ? styles.active : ''}`}
                onClick={() => handleFeatureToggle(feature)}
              >
                <span className={styles.featureIcon}>
                  {getFeatureIcon(feature)}
                </span>
                <span className={styles.featureText}>
                  {getFeatureLabel(feature)}
                </span>
              </button>
            ))}
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

const getFeatureIcon = (feature) => {
  const icons = {
    readableFont: 'Aa',
    highContrast: '◐',
    largeText: 'A+',
    highlightLinks: '🔗',
    textToSpeech: '🔊',
    dyslexiaFont: 'Dx',
    cursorHighlight: '👆',
    invertColors: '🔄',
    reducedMotion: '⚡',
    focusMode: '👀',
    readingGuide: '📏',
    monochrome: '⚫'
  };
  return icons[feature] || '⚙️';
};

const getFeatureLabel = (feature) => {
  const labels = {
    readableFont: 'Readable Font',
    highContrast: 'High Contrast',
    largeText: 'Large Text',
    highlightLinks: 'Highlight Links',
    textToSpeech: 'Text to Speech',
    dyslexiaFont: 'Dyslexia Font',
    cursorHighlight: 'Cursor Highlight',
    invertColors: 'Invert Colors',
    reducedMotion: 'Reduced Motion',
    focusMode: 'Focus Mode',
    readingGuide: 'Reading Guide',
    monochrome: 'Monochrome'
  };
  return labels[feature] || feature;
};

export default AccessibilityWidget;
