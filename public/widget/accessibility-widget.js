// Update the initWidget function to fetch global settings
async function initWidget() {
  const currentScript = document.currentScript;
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');
  const clientKey = currentScript?.getAttribute('data-client-key');

  if (!supabaseUrl || !supabaseKey || !clientKey) {
    console.error('Missing required configuration for accessibility widget');
    return;
  }

  try {
    // First fetch global widget settings
    const globalSettingsResponse = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!globalSettingsResponse.ok) {
      throw new Error('Failed to load global widget settings');
    }

    const globalSettings = await globalSettingsResponse.json();
    
    // Then fetch client data
    const clientResponse = await fetch(`${supabaseUrl}/rest/v1/clients?client_key=eq.${clientKey}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!clientResponse.ok) {
      throw new Error('Failed to load client data');
    }

    const clientData = await clientResponse.json();
    
    if (!clientData || !clientData.length) {
      throw new Error('No client found with this key');
    }

    // Combine global settings with client data
    const settings = {
      ...globalSettings[0], // Use first global settings entry
      client: clientData[0]
    };

    console.log('Loaded settings:', settings);
    createWidget(settings);
  } catch (error) {
    console.error('Error initializing widget:', error);
  }
}

// Update the addStyles function to use global settings
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

// Update the createWidget function to use global settings
function createWidget(settings) {
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  container.innerHTML = createWidgetHTML(settings);
  addStyles(settings);
  document.body.appendChild(container);
  setupEventListeners(container);
}

// Update createWidgetHTML to use settings for footer text
function createWidgetHTML(settings) {
  return `
    <div class="widget-toggle">
      <button aria-label="Accessibility Options">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
        </svg>
      </button>
    </div>
    <div class="widget-panel">
      <div class="widget-header">
        <h3>Accessibility Settings</h3>
      </div>
      <div class="widget-body">
        <div class="feature-grid">
          <!-- Feature buttons remain the same -->
        </div>
      </div>
      <div class="widget-footer">
        ${settings.powered_by_text || 'Powered by Accessibility Widget'}
      </div>
    </div>
  `;
}

// Rest of the code remains the same...
