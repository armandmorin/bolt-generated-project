(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Default settings
  const defaultSettings = {
    header_color: '#60a5fa',
    header_text_color: '#1e293b',
    button_color: '#2563eb',
    powered_by_text: 'Powered by Accessibility Widget',
    powered_by_color: '#64748b'
  };

  // Function to fetch settings from Supabase
  async function fetchSettings() {
    try {
      // Get global settings
      const response = await fetch(
        `${supabaseUrl}/rest/v1/global_widget_settings?select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const settings = await response.json();
      
      // Return first settings object or default settings
      return settings?.[0] || defaultSettings;
    } catch (error) {
      console.warn('Error fetching settings, using defaults:', error);
      return defaultSettings;
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
        background: ${settings.button_color};
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
        background: ${settings.header_color};
        border-radius: 8px 8px 0 0;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .accessibility-widget-header h3 {
        margin: 0;
        color: ${settings.header_text_color};
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
        color: ${settings.powered_by_color};
        font-size: 14px;
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 1;
      }
    `;
    document.head.appendChild(styles);

    // Add widget HTML with all features
    container.innerHTML = `
      <button class="accessibility-widget-button" aria-label="Accessibility Options">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
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

    // Rest of your feature implementation code...
    // (Keep all the existing feature implementation code)
  }

  // Initialize the widget
  initWidget().catch(console.error);
})();
