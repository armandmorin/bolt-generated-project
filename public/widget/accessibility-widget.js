(function() {
  const WIDGET_URL = 'YOUR_WIDGET_SERVER_URL'; // Replace with your actual widget server URL
  const CLIENT_KEY = document.currentScript.getAttribute('data-client-key');
  
  // Initialize settings with defaults
  let widgetSettings = {
    headerColor: '#2563eb',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b',
    version: 1
  };

  // Function to fetch latest settings
  async function fetchSettings() {
    try {
      const response = await fetch(`${WIDGET_URL}/api/widget-settings/${CLIENT_KEY}`);
      if (response.ok) {
        const newSettings = await response.json();
        
        // Only update if new version is available
        if (newSettings.version > widgetSettings.version) {
          widgetSettings = newSettings;
          updateWidgetStyles();
          updateWidgetContent();
        }
      }
    } catch (error) {
      console.error('Error fetching widget settings:', error);
    }
  }

  // Fetch settings initially
  fetchSettings();

  // Poll for updates every 5 minutes
  setInterval(fetchSettings, 5 * 60 * 1000);

  function updateWidgetStyles() {
    // Update dynamic styles
    const styleElement = document.getElementById('accessibility-widget-styles');
    if (styleElement) {
      styleElement.textContent = getStyles();
    }
  }

  function updateWidgetContent() {
    // Update widget content based on new settings
    const header = widgetContainer.querySelector('.widget-header');
    const footer = widgetContainer.querySelector('.widget-footer');
    const toggle = widgetContainer.querySelector('.widget-toggle');

    if (header) {
      header.style.backgroundColor = widgetSettings.headerColor;
      if (widgetSettings.headerLogo) {
        header.innerHTML = `
          <img src="${widgetSettings.headerLogo}" alt="Logo" class="widget-logo" />
          <h3>Accessibility Settings</h3>
        `;
      }
    }

    if (footer) {
      footer.textContent = widgetSettings.poweredByText;
      footer.style.color = widgetSettings.poweredByColor;
    }

    if (toggle) {
      toggle.style.backgroundColor = widgetSettings.buttonColor;
    }
  }

  // ... rest of the widget code ...
})();
