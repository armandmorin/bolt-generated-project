(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  let widgetSettings = {
    header_color: '#60a5fa',
    header_text_color: '#1e293b',
    button_color: '#2563eb',
    powered_by_text: 'Powered by Accessibility Widget',
    powered_by_color: '#64748b',
    button_size: '64px',
    button_position: 'bottom-right'
  };

  // Create widget immediately with default settings
  const createWidget = () => {
    const container = document.createElement('div');
    container.className = 'accessibility-widget-container';
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.bottom = '20px';
    container.style.zIndex = '99999';

    // Add base styles
    const styles = document.createElement('style');
    styles.textContent = `
      /* Base styles remain the same */
    `;
    document.head.appendChild(styles);

    container.innerHTML = `
      <!-- Widget HTML remains the same -->
    `;

    // Add event listeners
    const button = container.querySelector('.accessibility-widget-button');
    const panel = container.querySelector('.accessibility-widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    button.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    featureButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        const feature = btn.getAttribute('data-feature');
        handleFeature(feature, btn.classList.contains('active'));
      });
    });

    return container;
  };

  // Fetch settings from Supabase
  const fetchSettings = async () => {
    try {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials not provided');
        return;
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

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
    const button = document.querySelector('.accessibility-widget-button');
    const header = document.querySelector('.accessibility-widget-header');
    const footer = document.querySelector('.accessibility-widget-footer');
    const container = document.querySelector('.accessibility-widget-container');

    if (button) {
      button.style.backgroundColor = widgetSettings.button_color;
      button.style.width = widgetSettings.button_size;
      button.style.height = widgetSettings.button_size;
    }

    if (header) {
      header.style.backgroundColor = widgetSettings.header_color;
      header.style.color = widgetSettings.header_text_color;
    }

    if (footer) {
      footer.style.color = widgetSettings.powered_by_color;
      footer.textContent = widgetSettings.powered_by_text;
    }

    if (container) {
      // Reset all positions first
      container.style.left = 'auto';
      container.style.right = 'auto';
      container.style.top = 'auto';
      container.style.bottom = 'auto';

      // Apply new position
      if (widgetSettings.button_position.includes('left')) {
        container.style.left = '20px';
      } else {
        container.style.right = '20px';
      }
      
      if (widgetSettings.button_position.includes('top')) {
        container.style.top = '20px';
      } else {
        container.style.bottom = '20px';
      }
    }
  };

  // Initialize widget
  const init = async () => {
    // Create widget first with default settings
    const widget = createWidget();
    document.body.appendChild(widget);

    // Then fetch and apply custom settings
    await fetchSettings();

    // Set up real-time subscription if available
    if (supabaseUrl && supabaseKey) {
      const { createClient } = window.supabase;
      if (createClient) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        supabase
          .channel('global_widget_settings_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'global_widget_settings'
            },
            (payload) => {
              if (payload.new) {
                widgetSettings = { ...widgetSettings, ...payload.new };
                updateWidgetStyles();
              }
            }
          )
          .subscribe();
      }
    }
  };

  // Start initialization
  init();
})();
