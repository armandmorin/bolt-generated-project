import React, { useState } from 'react';

    const AccessibilityPopup = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [settings, setSettings] = useState({
        fontSize: 'medium',
        contrast: 'normal',
        highlightLinks: false,
        textToSpeech: false
      });

      const togglePopup = () => {
        setIsOpen(!isOpen);
      };

      const handleSettingChange = (setting, value) => {
        const newSettings = { ...settings, [setting]: value };
        setSettings(newSettings);
        applyAccessibilitySettings(newSettings);
      };

      const applyAccessibilitySettings = (settings) => {
        document.body.style.fontSize = settings.fontSize === 'large' ? '1.25rem' : '1rem';
        document.body.style.color = settings.contrast === 'high' ? '#000' : 'inherit';
        document.body.style.backgroundColor = settings.contrast === 'high' ? '#fff' : 'inherit';
        
        if (settings.highlightLinks) {
          document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = '#ffff00';
            link.style.padding = '2px';
          });
        } else {
          document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = '';
            link.style.padding = '';
          });
        }

        if (settings.textToSpeech) {
          if (!window.speechSynthesis.speaking) {
            const utterance = new SpeechSynthesisUtterance(document.body.innerText);
            window.speechSynthesis.speak(utterance);
          }
        } else {
          window.speechSynthesis.cancel();
        }
      };

      return (
        <>
          <button 
            className="accessibility-toggle"
            onClick={togglePopup}
            aria-label="Accessibility Settings"
          >
            ♿
          </button>

          {isOpen && (
            <div className="accessibility-popup">
              <h2>Accessibility Settings</h2>
              
              <div className="setting-group">
                <label>Text Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                >
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="setting-group">
                <label>Contrast</label>
                <select
                  value={settings.contrast}
                  onChange={(e) => handleSettingChange('contrast', e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                </select>
              </div>

              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.highlightLinks}
                    onChange={(e) => handleSettingChange('highlightLinks', e.target.checked)}
                  />
                  Highlight Links
                </label>
              </div>

              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.textToSpeech}
                    onChange={(e) => handleSettingChange('textToSpeech', e.target.checked)}
                  />
                  Text-to-Speech
                </label>
              </div>

              <button 
                className="close-btn"
                onClick={togglePopup}
              >
                Close
              </button>
            </div>
          )}
        </>
      );
    };

    export default AccessibilityPopup;
