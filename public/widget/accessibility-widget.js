(function() {
  // Internal Supabase configuration
  const SUPABASE_URL = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

  let globalSettings = null;

  async function getClientSettings(clientKey) {
    try {
      // First, get the client's ID using the client key
      const clientResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/clients?select=id&client_key=eq.${encodeURIComponent(clientKey)}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!clientResponse.ok) {
        throw new Error('Failed to fetch client');
      }

      const clientData = await clientResponse.json();
      if (!clientData || clientData.length === 0) {
        console.log('Client not found, falling back to global settings');
        return getGlobalSettings();
      }

      const clientId = clientData[0].id;

      // Then, get the client's specific widget settings
      const settingsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/widget_settings?select=*&client_id=eq.${clientId}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!settingsResponse.ok) {
        throw new Error('Failed to fetch client settings');
      }

      const settingsData = await settingsResponse.json();
      
      if (settingsData && settingsData.length > 0) {
        console.log('Using client-specific settings');
        return settingsData[0];
      }

      console.log('No client-specific settings found, falling back to global settings');
      return getGlobalSettings();
    } catch (error) {
      console.error('Error in getClientSettings:', error);
      return getGlobalSettings();
    }
  }

  async function getGlobalSettings() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/global_widget_settings?select=*`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch global settings');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        console.log('Using global settings');
        return data[0];
      }

      console.log('No global settings found, using defaults');
      return getDefaultSettings();
    } catch (error) {
      console.error('Error in getGlobalSettings:', error);
      return getDefaultSettings();
    }
  }

  function getDefaultSettings() {
    console.log('Using default settings');
    return {
      header_color: '#60a5fa',
      header_text_color: '#ffffff',
      button_color: '#2563eb',
      powered_by_text: 'Powered by Accessibility Widget',
      powered_by_color: '#64748b',
      button_size: '64px',
      button_position: 'bottom-right'
    };
  }

  // Rest of your existing widget code remains the same...
  // (Keep all the existing functions: createWidgetHTML, handleFeatureToggle, etc.)

  async function initWidget() {
    try {
      const scripts = document.getElementsByTagName('script');
      let currentScript;
      for (let script of scripts) {
        if (script.src.includes('accessibility-widget.js')) {
          currentScript = script;
          break;
        }
      }

      const clientKey = currentScript?.getAttribute('data-client-key');

      if (!clientKey) {
        console.error('Missing required client key for accessibility widget');
        return;
      }

      console.log('Initializing widget for client key:', clientKey);
      
      // Get client-specific or global settings
      const settings = await getClientSettings(clientKey);
      
      if (settings) {
        globalSettings = settings;
        console.log('Applied settings:', globalSettings);
        const container = document.createElement('div');
        container.id = 'accessibility-widget-container';
        container.innerHTML = createWidgetHTML(globalSettings);
        addStyles(globalSettings);
        document.body.appendChild(container);
        addEventListeners(container);
      }
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
