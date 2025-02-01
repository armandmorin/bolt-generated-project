(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Default settings
  let widgetSettings = {
    headerColor: '#60a5fa',
    headerTextColor: '#1e293b',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b',
    buttonSize: '64px',
    buttonPosition: 'bottom-right'
  };

  // Create and inject styles
  const createStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .accessibility-widget-container {
        position: fixed;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .accessibility-widget-button {
        width: ${widgetSettings.buttonSize};
        height: ${widgetSettings.buttonSize};
        padding: 0;
        border: none;
        border-radius: 50%;
        background-color: ${widgetSettings.buttonColor};
        color: white;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .accessibility-widget-button:hover {
        transform: scale(1.1);
      }

      .accessibility-widget-panel {
        position: absolute;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        overflow: hidden;
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      .accessibility-widget-header {
        padding: 16px;
        background: ${widgetSettings.headerColor};
        color: ${widgetSettings.headerTextColor};
      }

      .accessibility-widget-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .accessibility-widget-content {
        padding: 16px;
        max-height: 70vh;
        overflow-y: auto;
      }

      .widget-section {
        margin-bottom: 24px;
      }

      .widget-section h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
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
        gap: 8px;
        padding: 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
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
        line-height: 1;
      }

      .feature-text {
        font-size: 12px;
        text-align: center;
        line-height: 1.2;
      }

      .accessibility-widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: ${widgetSettings.poweredByColor};
      }
    `;
    document.head.appendChild(styleSheet);
  };

  // Create widget HTML
  const createWidget = () => {
    const container = document.createElement('div');
    container.className = 'accessibility-widget-container';
    
    // Set position based on settings
    if (widgetSettings.buttonPosition.includes('right')) {
      container.style.right = '20px';
    } else {
      container.style.left = '20px';
    }
    if (widgetSettings.buttonPosition.includes('bottom')) {
      container.style.bottom = '20px';
    } else {
      container.style.top = '20px';
    }

    container.innerHTML = `
      <button class="accessibility-widget-button" aria-label="Accessibility Options">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
        </svg>
      </button>
      <div class="accessibility-widget-panel">
        <div class="accessibility-widget-header">
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
                <span class="feature-text">Click to Speech</span>
              </button>
              <button class="feature-button" data-feature="fontScaling">
                <span class="feature-icon">T↕</span>
                <span class="feature-text">Font Scaling</span>
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
              <button class="feature-button" data-feature="darkMode">
                <span class="feature-icon">🌙</span>
                <span class="feature-text">Dark Mode</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accessibility-widget-footer">
          ${widgetSettings.poweredByText}
        </div>
      </div>
    `;

    document.body.appendChild(container);
    return container;
  };

  // Initialize widget functionality
  const initWidget = () => {
    const container = createWidget();
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

    // Feature button functionality
    featureButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const feature = btn.getAttribute('data-feature');
        handleFeature(feature, btn.classList.contains('active'));
      });
    });
  };

  // Handle accessibility features
  const handleFeature = (feature, isActive) => {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = isActive ? 
          'Arial, sans-serif' : '';
        break;
      case 'highContrast':
        if (isActive) {
          document.body.style.backgroundColor = '#000';
          document.body.style.color = '#fff';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        }
        break;
      case 'darkMode':
        document.documentElement.style.filter = isActive ?
          'invert(1) hue-rotate(180deg)' : '';
        break;
      case 'fontScaling':
        document.body.style.fontSize = isActive ?
          '120%' : '';
        break;
      // Add more feature handlers as needed
    }
  };

  // Fetch settings and initialize widget
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (response.ok) {
        const settings = await response.json();
        if (settings?.[0]) {
          widgetSettings = { ...widgetSettings, ...settings[0] };
        }
      }
    } catch (error) {
      console.warn('Error fetching widget settings:', error);
    }

    // Create styles and initialize widget
    createStyles();
    initWidget();
  };

  // Start the widget initialization
  fetchSettings();
})();
