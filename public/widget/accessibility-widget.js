// Update the loadSettings function in the widget
async function loadSettings() {
  // Try to get cached settings first
  const cachedSettings = localStorage.getItem(`accessibility-widget-settings-${clientKey}`);
  if (cachedSettings) {
    const settings = JSON.parse(cachedSettings);
    const cacheTime = localStorage.getItem(`accessibility-widget-settings-${clientKey}-time`);
    
    // Check if cache is less than 1 hour old
    if (cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      return settings;
    }
  }

  // Fetch settings from the current origin
  try {
    const response = await fetch(`${window.location.origin}/api/widget-settings/${clientKey}`);
    if (!response.ok) throw new Error('Failed to load widget settings');
    
    const settings = await response.json();
    // Cache the settings with timestamp
    localStorage.setItem(`accessibility-widget-settings-${clientKey}`, JSON.stringify(settings));
    localStorage.setItem(`accessibility-widget-settings-${clientKey}-time`, Date.now().toString());
    return settings;
  } catch (error) {
    console.error('Failed to load widget settings:', error);
    // Return default settings if fetch fails
    return {
      headerColor: '#60a5fa',
      headerTextColor: '#1e293b',
      buttonColor: '#2563eb',
      poweredByText: 'Powered by Accessibility Widget',
      poweredByColor: '#64748b'
    };
  }
}
