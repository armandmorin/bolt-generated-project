(function() {
  // Initialize settings with defaults
  let widgetSettings = {
    headerColor: '#2563eb',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b',
    lastUpdated: 0
  };

  // Function to load settings
  function loadSettings() {
    const storedSettings = localStorage.getItem('widgetSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      if (parsedSettings.lastUpdated > widgetSettings.lastUpdated) {
        widgetSettings = parsedSettings;
        updateWidgetStyles();
      }
    }
  }

  // Load initial settings
  loadSettings();

  // Listen for settings updates
  window.addEventListener('widgetSettingsUpdated', (event) => {
    widgetSettings = event.detail;
    updateWidgetStyles();
  });

  // Poll for settings changes (for widgets on different tabs/windows)
  setInterval(loadSettings, 5000);

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'accessibility-widget-container';
  document.body.appendChild(widgetContainer);

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = getStyles();
  document.head.appendChild(styles);

  function getStyles() {
    return `
      #accessibility-widget-container {
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
        background-color: ${widgetSettings.buttonColor};
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
        background-color: ${widgetSettings.headerColor};
        color: white;
      }

      /* ... rest of the styles ... */

      .widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: ${widgetSettings.poweredByColor};
      }
    `;
  }

  function updateWidgetStyles() {
    styles.textContent = getStyles();
    const footer = widgetContainer.querySelector('.widget-footer');
    if (footer) {
      footer.textContent = widgetSettings.poweredByText;
    }
  }

  // Create widget HTML
  widgetContainer.innerHTML = `
    <button class="widget-toggle" aria-label="Accessibility Options">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
      </svg>
    </button>
    <div class="widget-panel">
      <div class="widget-header">
        <h3>Accessibility Settings</h3>
      </div>
      <!-- Rest of the widget HTML structure -->
      <div class="widget-footer">
        ${widgetSettings.poweredByText}
      </div>
    </div>
  `;

  // ... rest of the widget code (features, event handlers, etc.) ...

})();
