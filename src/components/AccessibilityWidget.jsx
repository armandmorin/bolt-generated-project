import React, { useState, useEffect } from 'react';
import styles from '../styles/widget.module.css';

const AccessibilityWidget = ({ settings, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(isPreview);
  const [features, setFeatures] = useState({});

  const toggleWidget = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggleFeature = (feature, e) => {
    e.stopPropagation();
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    handleFeature(feature, !features[feature]);
  };

  const handleFeature = (feature, isActive) => {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = isActive ? 'Arial, sans-serif' : '';
        break;
      case 'readAllText':
        if (isActive) {
          const text = document.body.textContent;
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        } else {
          window.speechSynthesis.cancel();
        }
        break;
      case 'clickToSpeech':
        if (isActive) {
          document.body.addEventListener('click', handleClickToSpeech);
        } else {
          document.body.removeEventListener('click', handleClickToSpeech);
        }
        break;
      case 'fontScaling':
        document.body.style.fontSize = isActive ? '120%' : '';
        break;
      case 'highlightLinks':
        const links = document.querySelectorAll('a');
        links.forEach(link => {
          link.style.backgroundColor = isActive ? '#ffeb3b' : '';
          link.style.color = isActive ? '#000' : '';
        });
        break;
      case 'highlightTitles':
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          heading.style.backgroundColor = isActive ? '#e3f2fd' : '';
        });
        break;
      case 'highContrast':
        document.body.style.filter = isActive ? 'contrast(150%)' : '';
        break;
      case 'lightContrast':
        if (isActive) {
          document.body.style.backgroundColor = '#ffffff';
          document.body.style.color = '#000000';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        }
        break;
      case 'darkContrast':
        if (isActive) {
          document.body.style.backgroundColor = '#000000';
          document.body.style.color = '#ffffff';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        }
        break;
      case 'monochrome':
        document.body.style.filter = isActive ? 'grayscale(100%)' : '';
        break;
      case 'highSaturation':
        document.body.style.filter = isActive ? 'saturate(200%)' : '';
        break;
      case 'lowSaturation':
        document.body.style.filter = isActive ? 'saturate(50%)' : '';
        break;
      case 'muteSounds':
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach(element => {
          element.muted = isActive;
        });
        break;
      case 'hideImages':
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          img.style.display = isActive ? 'none' : '';
        });
        break;
      case 'stopAnimations':
        const style = document.createElement('style');
        style.id = 'stop-animations';
        style.textContent = '* { animation: none !important; transition: none !important; }';
        if (isActive) {
          document.head.appendChild(style);
        } else {
          document.getElementById('stop-animations')?.remove();
        }
        break;
      case 'highlightHover':
        if (isActive) {
          const style = document.createElement('style');
          style.id = 'highlight-hover';
          style.textContent = '*:hover { outline: 2px solid #2563eb !important; }';
          document.head.appendChild(style);
        } else {
          document.getElementById('highlight-hover')?.remove();
        }
        break;
      case 'bigCursor':
        document.body.style.cursor = isActive ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2\'/%3E%3C/svg%3E") 4 4, auto' : '';
        break;
    }
  };

  const handleClickToSpeech = (e) => {
    if (e.target.textContent) {
      const utterance = new SpeechSynthesisUtterance(e.target.textContent);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.widgetContainer}`)) {
        setIsOpen(false);
      }
    };

    if (!isPreview) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (!isPreview) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isPreview]);

  return (
    <div className={styles.widgetContainer}>
      <button 
        className={styles.widgetToggle}
        style={{
          backgroundColor: settings?.buttonColor || '#2563eb',
          width: settings?.buttonSize || '64px',
          height: settings?.buttonSize || '64px'
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
            backgroundColor: settings?.headerColor || '#60a5fa',
            color: settings?.headerTextColor || '#1e293b'
          }}
        >
          <h3>Accessibility Settings</h3>
        </div>

        <div className={styles.widgetBody}>
          {/* Content Adjustments */}
          <div className={styles.widgetSection}>
            <h4>Content Adjustments</h4>
            <div className={styles.featureGrid}>
              <button
                className={`${styles.featureButton} ${features.readableFont ? styles.active : ''}`}
                onClick={(e) => toggleFeature('readableFont', e)}
              >
                <span className={styles.featureIcon}>Aa</span>
                <span className={styles.featureText}>Readable Font</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.readAllText ? styles.active : ''}`}
                onClick={(e) => toggleFeature('readAllText', e)}
              >
                <span className={styles.featureIcon}>▶</span>
                <span className={styles.featureText}>Read All Text</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.clickToSpeech ? styles.active : ''}`}
                onClick={(e) => toggleFeature('clickToSpeech', e)}
              >
                <span className={styles.featureIcon}>🎧</span>
                <span className={styles.featureText}>Turn on Click to Speech</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.fontScaling ? styles.active : ''}`}
                onClick={(e) => toggleFeature('fontScaling', e)}
              >
                <span className={styles.featureIcon}>T↕</span>
                <span className={styles.featureText}>Font Scaling</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.highlightLinks ? styles.active : ''}`}
                onClick={(e) => toggleFeature('highlightLinks', e)}
              >
                <span className={styles.featureIcon}>🔗</span>
                <span className={styles.featureText}>Highlight Links</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.highlightTitles ? styles.active : ''}`}
                onClick={(e) => toggleFeature('highlightTitles', e)}
              >
                <span className={styles.featureIcon}>H</span>
                <span className={styles.featureText}>Highlight Titles</span>
              </button>
            </div>
          </div>

          {/* Color Adjustments */}
          <div className={styles.widgetSection}>
            <h4>Color Adjustments</h4>
            <div className={styles.featureGrid}>
              <button
                className={`${styles.featureButton} ${features.highContrast ? styles.active : ''}`}
                onClick={(e) => toggleFeature('highContrast', e)}
              >
                <span className={styles.featureIcon}>◐</span>
                <span className={styles.featureText}>High Contrast</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.lightContrast ? styles.active : ''}`}
                onClick={(e) => toggleFeature('lightContrast', e)}
              >
                <span className={styles.featureIcon}>☀</span>
                <span className={styles.featureText}>Light Contrast</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.darkContrast ? styles.active : ''}`}
                onClick={(e) => toggleFeature('darkContrast', e)}
              >
                <span className={styles.featureIcon}>🌙</span>
                <span className={styles.featureText}>Dark Contrast</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.monochrome ? styles.active : ''}`}
                onClick={(e) => toggleFeature('monochrome', e)}
              >
                <span className={styles.featureIcon}>◑</span>
                <span className={styles.featureText}>Monochrome</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.highSaturation ? styles.active : ''}`}
                onClick={(e) => toggleFeature('highSaturation', e)}
              >
                <span className={styles.featureIcon}>⚛</span>
                <span className={styles.featureText}>High Saturation</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.lowSaturation ? styles.active : ''}`}
                onClick={(e) => toggleFeature('lowSaturation', e)}
              >
                <span className={styles.featureIcon}>💧</span>
                <span className={styles.featureText}>Low Saturation</span>
              </button>
            </div>
          </div>

          {/* Orientation Adjustments */}
          <div className={styles.widgetSection}>
            <h4>Orientation Adjustments</h4>
            <div className={styles.featureGrid}>
              <button
                className={`${styles.featureButton} ${features.muteSounds ? styles.active : ''}`}
                onClick={(e) => toggleFeature('muteSounds', e)}
              >
                <span className={styles.featureIcon}>🔇</span>
                <span className={styles.featureText}>Mute Sounds</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.hideImages ? styles.active : ''}`}
                onClick={(e) => toggleFeature('hideImages', e)}
              >
                <span className={styles.featureIcon}>🖼</span>
                <span className={styles.featureText}>Hide Images</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.stopAnimations ? styles.active : ''}`}
                onClick={(e) => toggleFeature('stopAnimations', e)}
              >
                <span className={styles.featureIcon}>⛔</span>
                <span className={styles.featureText}>Stop Animations</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.highlightHover ? styles.active : ''}`}
                onClick={(e) => toggleFeature('highlightHover', e)}
              >
                <span className={styles.featureIcon}>🖱</span>
                <span className={styles.featureText}>Highlight Hover</span>
              </button>
              <button
                className={`${styles.featureButton} ${features.bigCursor ? styles.active : ''}`}
                onClick={(e) => toggleFeature('bigCursor', e)}
              >
                <span className={styles.featureIcon}>➜</span>
                <span className={styles.featureText}>Big Cursor</span>
              </button>
            </div>
          </div>
        </div>

        <div 
          className={styles.widgetFooter}
          style={{
            color: settings?.poweredByColor || '#64748b'
          }}
        >
          {settings?.poweredByText || 'Powered by Accessibility Widget'}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityWidget;
