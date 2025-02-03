(function() {
  const createWidget = () => {
    // Create widget container
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    return container;
  };

  const init = async () => {
    // Create and append widget first
    const widget = createWidget();
    document.body.appendChild(widget);

    // Get configuration from script tag
    const currentScript = document.currentScript;
    const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
    const supabaseKey = currentScript?.getAttribute('data-supabase-key');

    // Fetch settings if credentials are available
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.[0]) {
            updateWidgetStyles(data[0]);
          }
        }
      } catch (error) {
        console.warn('Error fetching widget settings:', error);
      }
    }
  };

  // Start initialization
  init();
})();
