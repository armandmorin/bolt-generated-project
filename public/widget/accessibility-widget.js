(function() {
  // Get client key from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');

  if (!clientKey) {
    console.error('Accessibility Widget: No client key provided');
    return;
  }

  // Function to fetch settings from server
  async function fetchSettings() {
    try {
      const response = await fetch(`${window.location.origin}/api/widget-settings/${clientKey}`);
      if (!response.ok) throw new Error('Failed to load widget settings');
      return await response.json();
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      return {
        headerColor: '#60a5fa',
        headerTextColor: '#1e293b',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Accessibility Widget',
        poweredByColor: '#64748b'
      };
    }
  }

  // Initialize widget with settings
  async function initWidget() {
    const settings = await fetchSettings();

    // Create and append widget container
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    document.body.appendChild(container);

    // Rest of the widget code remains the same...
    [Previous widget implementation code here]
  }

  // Initialize the widget
  initWidget();
})();
