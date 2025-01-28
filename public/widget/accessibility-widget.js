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

      return {
        headerColor: settings[0].header_color || '#60a5fa',
        headerTextColor: settings[0].header_text_color || '#1e293b',
        buttonColor: settings[0].button_color || '#2563eb',
        poweredByText: settings[0].powered_by_text || 'Powered by Accessibility Widget',
        poweredByColor: settings[0].powered_by_color || '#64748b'
      };
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      return {
        headerColor: '#60a5fa',
        headerTextColor: '#1e293b',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Accessibility Widget',
        poweredByColor: '#64748b'
      };
    }
  }

  // Create and inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    #accessibility-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .accessibility-widget-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: transform 0.3s ease;
      padding: 0;
    }

    .accessibility-widget-button:hover {
      transform: scale(1.1);
    }

    .accessibility-widget-panel {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: none;
      overflow-y: auto;
      max-height: 80vh;
    }

    .accessibility-widget-panel.open {
      display: block;
    }

    .accessibility-widget-header {
      padding: 16px;
      border-radius: 8px 8px 0 0;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .accessibility-widget-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .accessibility-widget-content {
      padding: 16px;
    }

    .widget-section {
      margin-bottom: 24px;
    }

    .widget-section h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #1e293b;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .feature-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 80px;
    }

    .feature-button:hover {
      background: #f1f5f9;
    }

    .feature-button.active {
      background: #e0e7ff;
      border-color: #818cf8;
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    .feature-text {
      font-size: 12px;
      text-align: center;
      color: #1e293b;
    }

    .accessibility-widget-footer {
      padding: 16px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
      position: sticky;
      bottom: 0;
      background: white;
      z-index: 1;
    }
  `;
  document.head.appendChild(styles);

  // Initialize widget with settings
  async function initWidget() {
    const settings = await fetchSettings();
    const features = {
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
    };

    function applyFeature(feature, isActive) {
      switch (feature) {
        case 'readableFont':
          document.body.style.fontFamily = isActive ? 'Arial, sans-serif' : '';
          document.body.style.lineHeight = isActive ? '1.6' : '';
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
        case 'fontScaling':
          document.body.style.fontSize = isActive ? '120%' : '';
          break;
        case 'highlightLinks':
          document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = isActive ? '#ffff00' : '';
            link.style.color = isActive ? '#000000' : '';
          });
          break;
        case 'highlightTitles':
          document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(title => {
            title.style.backgroundColor = isActive ? '#e0e7ff' : '';
          });
          break;
        case 'highContrast':
          document.body.style.filter = isActive ? 'contrast(150%)' : '';
          break;
        case 'lightContrast':
          document.body.style.filter = isActive ? 'brightness(120%)' : '';
          break;
        case 'darkContrast':
          document.body.style.filter = isActive ? 'brightness(80%)' : '';
          break;
        case 'monochrome':
          document.body.style.filter = isActive ? 'grayscale(100%)' : '';
          break;
        case 'highSaturation':
          document.body.style.filter = isActive ? 'saturate(150%)' : '';
          break;
        case 'lowSaturation':
          document.body.style.filter = isActive ? 'saturate(50%)' : '';
          break;
        case 'muteSounds':
          document.querySelectorAll('audio, video').forEach(element => {
            element.muted = isActive;
          });
          break;
        case 'hideImages':
          document.querySelectorAll('img').forEach(img => {
            img.style.display = isActive ? 'none' : '';
          });
          break;
        case 'stopAnimations':
          if (isActive) {
            const style = document.createElement('style');
            style.id = 'stop-animations';
            style.textContent = '* { animation: none !important; transition: none !important; }';
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
          document.body.style.cursor = isActive ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7-4.1 4z\'/%3E%3C/svg%3E") 0 0, auto' : '';
          break;
      }
    }

    // Create and append widget container
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    document.body.appendChild(container);

    // Add widget HTML
    container.innerHTML = `
      <button class="accessibility-widget-button" aria-label="Accessibility Options" style="background-color: ${settings.buttonColor}">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
        </svg>
      </button>
      <div class="accessibility-widget-panel">
        <div class="accessibility-widget-header" style="background-color: ${settings.headerColor}; color: ${settings.headerTextColor}">
          <h3>Accessibility Settings</h3>
        </div>
        <div class="accessibility-widget-content">
          <!-- Content Adjustments -->
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

          <!-- Color Adjustments -->
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

          <!-- Orientation Adjustments -->
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
        <div class="accessibility-widget-footer" style="color: ${settings.poweredByColor}">
          ${settings.poweredByText}
        </div>
      </div>
    `;

    // Get DOM elements
    const button = container.querySelector('.accessibility-widget-button');
    const panel = container.querySelector('.accessibility-widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    // Toggle panel
    button.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    // Handle feature buttons
    featureButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const feature = button.dataset.feature;
        const isActive = button.classList.toggle('active');
        features[feature] = isActive;
        
        // Reset other features in the same category if needed
        if (feature.includes('Contrast')) {
          featureButtons.forEach(btn => {
            if (btn !== button && btn.dataset.feature.includes('Contrast')) {
              btn.classList.remove('active');
              features[btn.dataset.feature] = false;
              applyFeature(btn.dataset.feature, false);
            }
          });
        }

        applyFeature(feature, isActive);
      });
    });
  }

  // Initialize the widget
  initWidget();
})();
