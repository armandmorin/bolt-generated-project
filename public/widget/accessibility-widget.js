// Update the fetchSettings function
async function fetchSettings() {
  try {
    // Try to get global settings
    const response = await fetch(
      `${supabaseUrl}/rest/v1/widget_settings?select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      // If global settings table doesn't exist, use widget_settings table
      const fallbackResponse = await fetch(
        `${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!fallbackResponse.ok) {
        throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
      }

      const fallbackSettings = await fallbackResponse.json();
      if (fallbackSettings && fallbackSettings.length > 0) {
        return fallbackSettings[0];
      }
    }

    const settings = await response.json();
    
    if (settings && settings.length > 0) {
      return settings[0];
    }

    // Return default settings if no settings found
    return {
      header_color: '#60a5fa',
      header_text_color: '#1e293b',
      button_color: '#2563eb',
      powered_by_text: 'Powered by Accessibility Widget',
      powered_by_color: '#64748b'
    };
  } catch (error) {
    console.warn('Error fetching settings, using defaults:', error);
    return {
      header_color: '#60a5fa',
      header_text_color: '#1e293b',
      button_color: '#2563eb',
      powered_by_text: 'Powered by Accessibility Widget',
      powered_by_color: '#64748b'
    };
  }
}
