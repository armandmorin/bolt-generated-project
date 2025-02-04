(function() {
  let globalSettings = null;

  async function initWidget() {
    try {
      // Find our script tag
      const scripts = document.getElementsByTagName('script');
      let currentScript;
      for (let script of scripts) {
        if (script.src.includes('accessibility-widget.js')) {
          currentScript = script;
          break;
        }
      }

      const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
      const supabaseKey = currentScript?.getAttribute('data-supabase-key');
      const clientKey = currentScript?.getAttribute('data-client-key');

      if (!supabaseUrl || !supabaseKey || !clientKey) {
        console.error('Missing required configuration for accessibility widget');
        return;
      }

      // Fetch global settings first
      const response = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load widget settings');
      }

      const settings = await response.json();
      if (settings && settings.length > 0) {
        globalSettings = settings[0];
        console.log('Loaded global settings:', globalSettings);
        createWidget(globalSettings);
      }
    } catch (error) {
      console.error('Error initializing widget:', error);
      // Create widget with default settings if fetch fails
      createWidget({});
    }
  }

  function createWidget(settings) {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    container.innerHTML = createWidgetHTML(settings);
    addStyles(settings);
    document.body.appendChild(container);
    addEventListeners(container);
  }

  function createWidgetHTML(settings) {
    return `
      <div class="widget-toggle">
        <button aria-label="Accessibility Options">
          <svg viewBox="0 0 122.88 122.88" class="widget-icon">
            <path fill="currentColor" d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"/>
          </svg>
        </button>
      </div>
      <div class="widget-panel">
        <div class="widget-header">
          <h3>Accessibility Settings</h3>
        </div>
        <div class="widget-body">
          <div class="feature-grid">
            <!-- Feature buttons here -->
          </div>
        </div>
        <div class="widget-footer">
          ${settings.powered_by_text || 'Powered by Accessibility Widget'}
        </div>
      </div>
    `;
  }

  function addStyles(settings) {
    const styles = document.createElement('style');
    styles.textContent = `
      #accessibility-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .widget-toggle button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${settings.button_size || '64px'};
        height: ${settings.button_size || '64px'};
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background-color: ${settings.button_color || '#2563eb'};
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s ease;
        padding: 0;
      }

      .widget-toggle .widget-icon {
        width: 32px;
        height: 32px;
        color: white;
      }

      .widget-toggle button:hover {
        transform: scale(1.1);
      }

      .widget-panel {
        position: absolute;
        bottom: calc(100% + 16px);
        right: 0;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        max-height: 80vh;
        overflow-y: auto;
      }

      .widget-panel.open {
        display: block;
      }

      .widget-header {
        padding: 16px;
        background: ${settings.header_color || '#60a5fa'};
        color: ${settings.header_text_color || '#ffffff'};
        position: sticky;
        top: 0;
        z-index: 1;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }

      .widget-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .widget-body {
        padding: 16px;
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
        width: 100%;
        min-height: 80px;
      }

      .feature-button:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
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
        color: #475569;
        margin: 0;
        padding: 0;
      }

      .widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: ${settings.powered_by_color || '#64748b'};
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 1;
      }
    `;
    document.head.appendChild(styles);
  }

  function addEventListeners(container) {
    const toggle = container.querySelector('.widget-toggle button');
    const panel = container.querySelector('.widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    featureButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('active');
        const feature = button.dataset.feature;
        // Feature toggle logic here
      });
    });
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
