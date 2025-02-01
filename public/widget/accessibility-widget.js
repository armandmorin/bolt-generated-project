(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  let widgetSettings = {
    headerColor: '#60a5fa',
    headerTextColor: '#1e293b',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b',
    buttonSize: '64px',
    buttonPosition: 'bottom-right'
  };

  // Fetch settings from Supabase
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const data = await response.json();
      if (data && data[0]) {
        widgetSettings = { ...widgetSettings, ...data[0] };
        updateWidgetStyles();
      }
    } catch (error) {
      console.warn('Error fetching widget settings:', error);
    }
  };

  // Update widget styles based on settings
  const updateWidgetStyles = () => {
    const widget = document.querySelector('.accessibility-widget-container');
    if (!widget) return;

    const button = widget.querySelector('.accessibility-widget-button');
    const header = widget.querySelector('.accessibility-widget-header');
    const footer = widget.querySelector('.accessibility-widget-footer');

    // Update button
    if (button) {
      button.style.backgroundColor = widgetSettings.buttonColor;
      button.style.width = widgetSettings.buttonSize;
      button.style.height = widgetSettings.buttonSize;
    }

    // Update header
    if (header) {
      header.style.backgroundColor = widgetSettings.headerColor;
      header.style.color = widgetSettings.headerTextColor;
    }

    // Update footer
    if (footer) {
      footer.style.color = widgetSettings.poweredByColor;
      footer.textContent = widgetSettings.poweredByText;
    }

    // Update position
    if (widgetSettings.buttonPosition) {
      widget.style.left = widgetSettings.buttonPosition.includes('left') ? '20px' : 'auto';
      widget.style.right = widgetSettings.buttonPosition.includes('right') ? '20px' : 'auto';
      widget.style.top = widgetSettings.buttonPosition.includes('top') ? '20px' : 'auto';
      widget.style.bottom = widgetSettings.buttonPosition.includes('bottom') ? '20px' : 'auto';
    }
  };

  // Set up real-time subscription
  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .from('global_widget_settings')
      .on('UPDATE', payload => {
        widgetSettings = { ...widgetSettings, ...payload.new };
        updateWidgetStyles();
      })
      .subscribe();
  };

  // Rest of your widget code...

  // Initialize widget
  const init = async () => {
    await fetchSettings();
    const widget = createWidget();
    document.body.appendChild(widget);
    setupRealtimeSubscription();
  };

  init();
})();
