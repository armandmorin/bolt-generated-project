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

  // Add widget styles
  const styles = document.createElement('style');
  styles.textContent = `
    .widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .widget-toggle {
      width: 48px;
      height: 48px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background-color: #2563eb;
      color: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .widget-toggle:hover {
      transform: scale(1.1);
    }

    .widget-panel {
      position: absolute;
      bottom: 60px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: none;
    }

    .widget-panel.open {
      display: block;
    }

    .widget-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .widget-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .widget-body {
      padding: 16px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .widget-section {
      margin-bottom: 24px;
    }

    .widget-section:last-child {
      margin-bottom: 0;
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
      color: #4f46e5;
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

    .widget-footer {
      padding: 12px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #e2e8f0;
    }
  `;
  document.head.appendChild(styles);

  // Create widget HTML
  const container = document.createElement('div');
  container.className = 'widget-container';
  
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
      return settings[0] || {
        header_color: '#60a5fa',
        header_text_color: '#1e293b',
        button_color: '#2563eb',
        powered_by_text: 'Powered by Accessibility Widget',
        powered_by_color: '#64748b'
      };
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

  // Initialize widget
  async function initWidget() {
    const settings = await fetchSettings();
    
    container.innerHTML = `
      <button class="widget-toggle" aria-label="Accessibility Options" style="background-color: ${settings.button_color}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
        </svg>
      </button>
      <div class="widget-panel">
        <div class="widget-header" style="background-color: ${settings.header_color}">
          <h3 style="color: ${settings.header_text_color}">Accessibility Settings</h3>
        </div>
        <div class="widget-body">
          <div class="widget-section">
            <h4>Content Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="readableFont">
                <span class="feature-icon">Aa</span>
                <span class="feature-text">Readable Font</span>
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
            </div>
          </div>

          <div class="widget-section">
            <h4>Orientation Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="hideImages">
                <span class="feature-icon">🖼</span>
                <span class="feature-text">Hide Images</span>
              </button>
              <button class="feature-button" data-feature="stopAnimations">
                <span class="feature-icon">⛔</span>
                <span class="feature-text">Stop Animations</span>
              </button>
            </div>
          </div>
        </div>
        <div class="widget-footer" style="color: ${settings.powered_by_color}">
          ${settings.powered_by_text}
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Add event listeners
    const toggle = container.querySelector('.widget-toggle');
    const panel = container.querySelector('.widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    // Feature button functionality
    featureButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('active');
        const feature = button.dataset.feature;
        applyFeature(feature, button.classList.contains('active'));
      });
    });
  }

  // Apply accessibility features
  function applyFeature(feature, active) {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = active ? 'Arial, sans-serif' : '';
        document.body.style.lineHeight = active ? '1.6' : '';
        break;
      case 'fontScaling':
        document.body.style.fontSize = active ? '120%' : '';
        break;
      case 'highlightLinks':
        document.querySelectorAll('a').forEach(link => {
          link.style.backgroundColor = active ? '#ffff00' : '';
          link.style.color = active ? '#000000' : '';
        });
        break;
      case 'highlightTitles':
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(title => {
          title.style.backgroundColor = active ? '#e0e7ff' : '';
        });
        break;
      case 'highContrast':
        document.body.style.filter = active ? 'contrast(150%)' : '';
        break;
      case 'lightContrast':
        document.body.style.filter = active ? 'brightness(120%)' : '';
        break;
      case 'darkContrast':
        document.body.style.filter = active ? 'brightness(80%)' : '';
        break;
      case 'monochrome':
        document.body.style.filter = active ? 'grayscale(100%)' : '';
        break;
      case 'hideImages':
        document.querySelectorAll('img').forEach(img => {
          img.style.display = active ? 'none' : '';
        });
        break;
      case 'stopAnimations':
        if (active) {
          const style = document.createElement('style');
          style.id = 'stop-animations';
          style.textContent = '* { animation: none !important; transition: none !important; }';
          document.head.appendChild(style);
        } else {
          document.getElementById('stop-animations')?.remove();
        }
        break;
    }
  }

  // Initialize the widget
  initWidget();
})();
