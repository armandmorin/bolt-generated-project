(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Create widget immediately with default settings
  const createWidget = () => {
    const container = document.createElement('div');
    container.className = 'accessibility-widget-container';
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.bottom = '20px';
    container.style.zIndex = '99999';

    // Add base styles
    const styles = document.createElement('style');
    styles.textContent = `
      .accessibility-widget-container {
        position: fixed;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .accessibility-widget-button {
        width: 64px;
        height: 64px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background-color: #2563eb;
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
        bottom: calc(100% + 16px);
        right: 0;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        overflow: hidden;
        max-height: 80vh;
        overflow-y: auto;
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      .accessibility-widget-header {
        padding: 16px;
        background: #60a5fa;
        color: #1e293b;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .accessibility-widget-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .accessibility-widget-content {
        padding: 16px;
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
        color: #64748b;
        position: sticky;
        bottom: 0;
        background: white;
      }
    `;
    document.head.appendChild(styles);

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
        </div>
        <div class="accessibility-widget-footer">
          Powered by Accessibility Widget
        </div>
      </div>
    `;

    // Add event listeners
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

    featureButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        const feature = btn.getAttribute('data-feature');
        handleFeature(feature, btn.classList.contains('active'));
      });
    });

    return container;
  };

  // Initialize widget immediately
  const widget = createWidget();
  document.body.appendChild(widget);

  // Fetch settings after widget is created
  const fetchSettings = async () => {
    try {
      if (!supabaseUrl || !supabaseKey) return;

      const response = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) return;
      
      const data = await response.json();
      if (data?.[0]) {
        updateWidgetStyles(data[0]);
      }
    } catch (error) {
      console.warn('Error fetching widget settings:', error);
    }
  };

  const updateWidgetStyles = (settings) => {
    const button = document.querySelector('.accessibility-widget-button');
    const header = document.querySelector('.accessibility-widget-header');
    const footer = document.querySelector('.accessibility-widget-footer');
    const container = document.querySelector('.accessibility-widget-container');

    if (button && settings.button_color) {
      button.style.backgroundColor = settings.button_color;
      if (settings.button_size) {
        button.style.width = settings.button_size;
        button.style.height = settings.button_size;
      }
    }

    if (header && settings.header_color) {
      header.style.backgroundColor = settings.header_color;
      header.style.color = settings.header_text_color || '#1e293b';
    }

    if (footer && settings.powered_by_color) {
      footer.style.color = settings.powered_by_color;
      footer.textContent = settings.powered_by_text || 'Powered by Accessibility Widget';
    }

    if (container && settings.button_position) {
      container.style.left = settings.button_position.includes('left') ? '20px' : 'auto';
      container.style.right = settings.button_position.includes('right') ? '20px' : 'auto';
      container.style.top = settings.button_position.includes('top') ? '20px' : 'auto';
      container.style.bottom = settings.button_position.includes('bottom') ? '20px' : 'auto';
    }
  };

  // Start fetching settings
  fetchSettings();
})();
