(function() {
  // Get settings from the script tag data attributes
  const script = document.currentScript;
  const clientKey = script.getAttribute('data-client-key');
  const apiUrl = script.getAttribute('data-api-url');

  // Function to fetch settings from the server
  async function fetchSettings() {
    try {
      const response = await fetch(`${apiUrl}/api/widget-settings/${clientKey}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Error fetching widget settings:', e);
    }
    return null;
  }

  // Initialize widget with default settings
  async function initWidget() {
    // Get settings from server or use defaults
    const settings = await fetchSettings() || {
      headerColor: '#60a5fa',
      headerTextColor: '#1e293b',
      buttonColor: '#2563eb',
      poweredByText: 'Powered by Accessibility Widget',
      poweredByColor: '#64748b'
    };

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'accessibility-widget-container';
    document.body.appendChild(widgetContainer);

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      /* ... (previous styles remain the same until widget-toggle) ... */

      .widget-toggle {
        width: 64px;
        height: 64px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background-color: ${settings.buttonColor};
        color: white;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* ... (other styles remain the same until widget-header) ... */

      .widget-header {
        padding: 20px;
        background-color: ${settings.headerColor};
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .widget-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: ${settings.headerTextColor};
      }

      /* ... (other styles remain the same until widget-footer) ... */

      .widget-footer {
        padding: 16px;
        text-align: center;
        font-size: 14px;
        border-top: 1px solid #e2e8f0;
        color: ${settings.poweredByColor};
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 1;
      }
    `;
    document.head.appendChild(styles);

    // Create widget HTML
    widgetContainer.innerHTML = `
      <button class="widget-toggle" aria-label="Accessibility Options">
        <svg class="widget-toggle-icon" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 8.333c-23.024 0-41.667 18.643-41.667 41.667S26.976 91.667 50 91.667 91.667 73.024 91.667 50 73.024 8.333 50 8.333zM25 45.833h12.5v-8.333h25v8.333h12.5v4.167H62.5v8.333h-25V50H25v-4.167zm25-20.833c4.602 0 8.333 3.731 8.333 8.333s-3.731 8.334-8.333 8.334-8.333-3.732-8.333-8.334 3.731-8.333 8.333-8.333z"/>
        </svg>
      </button>
      <div class="widget-panel">
        <div class="widget-header">
          <h3>Accessibility Settings</h3>
        </div>
        <div class="widget-body">
          <!-- ... (rest of the widget body HTML remains the same) ... -->
        </div>
        <div class="widget-footer">
          ${settings.poweredByText}
        </div>
      </div>
    `;

    // ... (rest of the JavaScript functionality remains the same) ...
  }

  // Initialize the widget
  initWidget();
})();
