(function() {
  // Get domain from localStorage (set by super admin)
  const WIDGET_URL = localStorage.getItem('widgetDomain') || window.location.origin;
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

  // Rest of the widget code remains the same...
})();
