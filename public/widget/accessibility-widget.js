(function() {
  const SUPABASE_URL = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

  // Get client key from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');

  if (!clientKey) {
    console.error('Accessibility Widget: No client key provided');
    return;
  }

  // Function to fetch settings from Supabase
  async function fetchSettings() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const settings = await response.json();
      
      if (!settings || settings.length === 0) {
        throw new Error('No settings found for this client key');
      }

      // Return the first settings object
      return {
        headerColor: settings[0].header_color,
        headerTextColor: settings[0].header_text_color,
        buttonColor: settings[0].button_color,
        poweredByText: settings[0].powered_by_text,
        poweredByColor: settings[0].powered_by_color
      };
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      // Return default settings
      return {
        headerColor: '#60a5fa',
        headerTextColor: '#1e293b',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Accessibility Widget',
        poweredByColor: '#64748b'
      };
    }
  }

  // Rest of the widget code remains the same...
})();
