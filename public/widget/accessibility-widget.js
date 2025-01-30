(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Validate required parameters
  if (!clientKey || !supabaseUrl || !supabaseKey) {
    console.error('Accessibility Widget: Missing required configuration');
    return;
  }

  // Function to fetch settings from Supabase
  async function fetchSettings() {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const settings = await response.json();

      if (!settings || settings.length === 0) {
        throw new Error('No settings found for this client key');
      }

      return settings[0];
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      return {
        header_color: '#60a5fa',
        header_text_color: '#1e293b',
        button_color: '#2563eb',
        powered_by_text: 'Powered by Accessibility Widget',
        powered_by_color: '#64748b'
      };
    }
  }

  // Initialize widget with settings
  async function initWidget() {
    const settings = await fetchSettings();

    // Create and append widget container
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    document.body.appendChild(container);

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      /* Your existing styles here */
    `;
    document.head.appendChild(styles);

    // Add widget HTML with all 17 features
    container.innerHTML = `
      <button class="accessibility-widget-button" aria-label="Accessibility Options">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="m11.997 1.771h-.001c-5.647 0-10.226 4.578-10.226 10.226s4.578 10.226 10.226 10.226c5.647 0 10.226-4.578 10.226-10.226 0-5.647-4.578-10.225-10.225-10.226zm.198 2.252c.801 0 1.45.649 1.45 1.45s-.649 1.45-1.45 1.45-1.45-.649-1.45-1.45c0-.801.649-1.45 1.45-1.45zm5.307 3.668c-.087.117-.216.199-.364.223h-.003l-3.445.53c-.03.002-.056.017-.074.038-.018.022.343 4.274.343 4.274l1.958 5.337c.055.104.087.226.087.357 0 .295-.165.551-.407.681l-.004.002c-.074.033-.161.053-.253.053-.001 0-.001 0-.002 0-.33-.016-.608-.224-.728-.513l-.002-.006s-2.508-5.691-2.522-5.734c-.016-.047-.06-.081-.112-.081-.048 0-.088.031-.103.074v.001c-.014.041-2.522 5.734-2.522 5.734-.121.294-.399.501-.727.518h-.002c-.001 0-.001 0-.002 0-.091 0-.178-.019-.256-.054l.004.002c-.176-.08-.308-.229-.364-.411l-.001-.005c-.025-.078-.04-.168-.04-.261 0-.133.029-.258.082-.371l-.002.005s1.91-5.165 1.911-5.174l.355-4.363c0-.003 0-.006 0-.01 0-.054-.04-.099-.092-.107h-.001l-3.36-.52c-.271-.043-.475-.275-.475-.554 0-.31.251-.561.561-.561.03 0 .06.002.089.007h-.003l3.223.498h3.421c.007.002.015.003.024.003s.016-.001.024-.003h-.001l3.244-.497c.024-.004.052-.006.08-.006.28 0 .513.203.56.47v.003c.004.026.007.057.007.088 0 .124-.04.238-.109.33l.001-.002z"/>
        </svg>
      </button>
      <div class="accessibility-widget-panel">
        <div class="accessibility-widget-header">
          <h3>Accessibility Settings</h3>
        </div>
        <div class="accessibility-widget-content">
          <div class="widget-section">
            <h4>Content Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="readableFont">
                <span class="feature-icon">Aa</span>
                <span class="feature-text">Readable Font</span>
              </button>
              <button class="feature-button" data-feature="readAllText">
                <span class="feature-icon">▶</span>
                <span class="feature-text">Read All Text</span>
              </button>
              <button class="feature-button" data-feature="clickToSpeech">
                <span class="feature-icon">🎧</span>
                <span class="feature-text">Turn on Click to Speech</span>
              </button>
              <button class="feature-button" data-feature="fontScaling">
                <span class="feature-icon">T↕</span>
                <span class="feature-text">Font Scaling</span>
              </button>
              <button class="feature-button" data-feature="highlightLinks">
                <span class="feature-icon">🔗</span>
                <span class="feature-text">Highlight Links</span>
              </button>
              <button class="feature-button" data-feature="highlightTitles">
                <span class="feature-icon">H</span>
                <span class="feature-text">Highlight Titles</span>
              </button>
            </div>
          </div>

          <div class="widget-section">
            <h4>Color Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="highContrast">
                <span class="feature-icon">◐</span>
                <span class="feature-text">High Contrast</span>
              </button>
              <button class="feature-button" data-feature="lightContrast">
                <span class="feature-icon">☀</span>
                <span class="feature-text">Light Contrast</span>
              </button>
              <button class="feature-button" data-feature="darkContrast">
                <span class="feature-icon">🌙</span>
                <span class="feature-text">Dark Contrast</span>
              </button>
              <button class="feature-button" data-feature="monochrome">
                <span class="feature-icon">◑</span>
                <span class="feature-text">Monochrome</span>
              </button>
              <button class="feature-button" data-feature="highSaturation">
                <span class="feature-icon">⚛</span>
                <span class="feature-text">High Saturation</span>
              </button>
              <button class="feature-button" data-feature="lowSaturation">
                <span class="feature-icon">💧</span>
                <span class="feature-text">Low Saturation</span>
              </button>
            </div>
          </div>

          <div class="widget-section">
            <h4>Orientation Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="muteSounds">
                <span class="feature-icon">🔇</span>
                <span class="feature-text">Mute Sounds</span>
              </button>
              <button class="feature-button" data-feature="hideImages">
                <span class="feature-icon">🖼</span>
                <span class="feature-text">Hide Images</span>
              </button>
              <button class="feature-button" data-feature="stopAnimations">
                <span class="feature-icon">⛔</span>
                <span class="feature-text">Stop Animations</span>
              </button>
              <button class="feature-button" data-feature="highlightHover">
                <span class="feature-icon">🖱</span>
                <span class="feature-text">Highlight Hover</span>
              </button>
              <button class="feature-button" data-feature="bigCursor">
                <span class="feature-icon">➜</span>
                <span class="feature-text">Big Cursor</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accessibility-widget-footer">
          ${settings.powered_by_text}
        </div>
      </div>
    `;

    // Feature functionality
    const features = {
      readableFont: {
        apply: (active) => {
          document.body.style.fontFamily = active ? 'Arial, sans-serif' : '';
          document.body.style.lineHeight = active ? '1.6' : '';
        }
      },
      readAllText: {
        apply: (active) => {
          if (active) {
            const utterance = new SpeechSynthesisUtterance(document.body.innerText);
            window.speechSynthesis.speak(utterance);
          } else {
            window.speechSynthesis.cancel();
          }
        }
      },
      clickToSpeech: {
        apply: (active) => {
          if (active) {
            document.body.addEventListener('click', speakText);
          } else {
            document.body.removeEventListener('click', speakText);
          }
        }
      },
      fontScaling: {
        apply: (active) => {
          document.body.style.fontSize = active ? '120%' : '';
        }
      },
      highlightLinks: {
        apply: (active) => {
          document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = active ? '#ffff00' : '';
            link.style.color = active ? '#000000' : '';
          });
        }
      },
      highlightTitles: {
        apply: (active) => {
          document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(title => {
            title.style.backgroundColor = active ? '#e0e7ff' : '';
          });
        }
      },
      highContrast: {
        apply: (active) => {
          document.body.style.filter = active ? 'contrast(150%)' : '';
        }
      },
      lightContrast: {
        apply: (active) => {
          document.body.style.filter = active ? 'brightness(120%)' : '';
        }
      },
      darkContrast: {
        apply: (active) => {
          document.body.style.filter = active ? 'brightness(80%)' : '';
        }
      },
      monochrome: {
        apply: (active) => {
          document.body.style.filter = active ? 'grayscale(100%)' : '';
        }
      },
      highSaturation: {
        apply: (active) => {
          document.body.style.filter = active ? 'saturate(150%)' : '';
        }
      },
      lowSaturation: {
        apply: (active) => {
          document.body.style.filter = active ? 'saturate(50%)' : '';
        }
      },
      muteSounds: {
        apply: (active) => {
          document.querySelectorAll('audio, video').forEach(element => {
            element.muted = active;
          });
        }
      },
      hideImages: {
        apply: (active) => {
          document.querySelectorAll('img').forEach(img => {
            img.style.display = active ? 'none' : '';
          });
        }
      },
      stopAnimations: {
        apply: (active) => {
          const style = document.createElement('style');
          style.id = 'stop-animations';
          style.textContent = '* { animation: none !important; transition: none !important; }';
          if (active) {
            document.head.appendChild(style);
          } else {
            document.getElementById('stop-animations')?.remove();
          }
        }
      },
      highlightHover: {
        apply: (active) => {
          if (active) {
            const style = document.createElement('style');
            style.id = 'highlight-hover';
            style.textContent = '*:hover { outline: 2px solid #2563eb !important; }';
            document.head.appendChild(style);
          } else {
            document.getElementById('highlight-hover')?.remove();
          }
        }
      },
      bigCursor: {
        apply: (active) => {
          if (active) {
            const style = document.createElement('style');
            style.id = 'big-cursor';
            style.textContent = '* { cursor: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2\'/%3E%3C/svg%3E") 4 4, auto !important; }';
            document.head.appendChild(style);
          } else {
            document.getElementById('big-cursor')?.remove();
          }
        }
      }
    };

    // Helper function for click-to-speech
    function speakText(event) {
      const text = event.target.textContent;
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }

    // Event handlers
    const button = container.querySelector('.accessibility-widget-button');
    const panel = container.querySelector('.accessibility-widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    button.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    featureButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const feature = button.dataset.feature;
        const isActive = button.classList.toggle('active');
        
        if (feature.includes('Contrast') || feature.includes('Saturation')) {
          featureButtons.forEach(btn => {
            if (btn !== button && (btn.dataset.feature.includes('Contrast') || btn.dataset.feature.includes('Saturation'))) {
              btn.classList.remove('active');
              features[btn.dataset.feature].apply(false);
            }
          });
        }

        if (features[feature]) {
          features[feature].apply(isActive);
        }
      });
    });
  }

  // Initialize the widget
  initWidget();
})();
