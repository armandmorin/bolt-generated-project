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
      const response = await fetch(`${SUPABASE_URL}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (!response.ok) throw new Error('Failed to load widget settings');
      
      const [settings] = await response.json();
      return settings || {
        headerColor: '#60a5fa',
        headerTextColor: '#1e293b',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Accessibility Widget',
        poweredByColor: '#64748b'
      };
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
    
    // Rest of the widget initialization code...
    [Previous widget implementation code here]
  }

  // Initialize the widget
  initWidget();
})();
