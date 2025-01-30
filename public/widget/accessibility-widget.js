(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Validate required parameters
  if (!clientKey || !supabaseUrl || !supabaseKey) {
    console.error('Accessibility Widget: Missing required configuration');
    return;
  }

  // Default settings to use when no settings are found
  const defaultSettings = {
    header_color: '#60a5fa',
    header_text_color: '#1e293b',
    button_color: '#2563eb',
    powered_by_text: 'Powered by Accessibility Widget',
    powered_by_color: '#64748b'
  };

  // Function to fetch settings from Supabase
  async function fetchSettings() {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        console.warn('Using default settings due to API error');
        return defaultSettings;
      }

      const settings = await response.json();

      // If no settings found, create default settings
      if (!settings || settings.length === 0) {
        console.log('No settings found, creating default settings...');
        
        try {
          // Attempt to create default settings
          const createResponse = await fetch(
            `${supabaseUrl}/rest/v1/widget_settings`,
            {
              method: 'POST',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                client_key: clientKey,
                ...defaultSettings
              })
            }
          );

          if (!createResponse.ok) {
            console.warn('Failed to create default settings');
          }
        } catch (createError) {
          console.warn('Error creating default settings:', createError);
        }

        return defaultSettings;
      }

      // Merge received settings with defaults to ensure all properties exist
      return {
        ...defaultSettings,
        ...settings[0]
      };
    } catch (error) {
      console.warn('Error fetching settings, using defaults:', error);
      return defaultSettings;
    }
  }

  // Rest of your widget code remains the same...
  // ... (keep all the existing code below this point)

})();
