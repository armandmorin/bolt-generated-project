(function() {
  async function initWidget() {
    // Get configuration from script tag
    const currentScript = document.currentScript;
    const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
    const supabaseKey = currentScript?.getAttribute('data-supabase-key');
    const clientKey = currentScript?.getAttribute('data-client-key');

    if (!supabaseUrl || !supabaseKey || !clientKey) {
      console.error('Missing required configuration for accessibility widget');
      return;
    }

    try {
      // Fetch client-specific settings
      const response = await fetch(`${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load widget settings');
      }

      const settings = await response.json();
      if (!settings || !settings.length) {
        throw new Error('No settings found for this client');
      }

      // Create widget with settings
      createWidget(settings[0]);
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  function createWidget(settings) {
    // Create container
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    
    // Add your existing widget HTML and event listeners here
    container.innerHTML = createWidgetHTML();
    
    // Add styles with settings
    addStyles(settings);
    
    // Add to page
    document.body.appendChild(container);
    
    // Add event listeners
    setupEventListeners(container);
  }

  // Your existing helper functions (createWidgetHTML, addStyles, setupEventListeners)
  // ... rest of your existing code ...

  // Load widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
