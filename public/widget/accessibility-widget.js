// Update the fetchSettings function
async function fetchSettings() {
  try {
    // Try to get global settings
    const response = await fetch(
      `${supabaseUrl}/rest/v1/global_widget_settings?select=*&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const settings = await response.json();
    
    if (settings && settings.length > 0) {
      return settings[0];
    }

    // Return default settings if no global settings found
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
