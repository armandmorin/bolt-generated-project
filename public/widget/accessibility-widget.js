(function() {
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
        console.error('Missing client key for accessibility widget');
        return;
      }

      // Use your API endpoint instead of direct Supabase access
      const response = await fetch(`${window.location.origin}/api/widget-settings?clientKey=${clientKey}`);

      if (!response.ok) {
        throw new Error('Failed to load widget settings');
      }

      const settings = await response.json();
      if (settings) {
        createWidget(settings);
      }
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  // Rest of the widget code remains the same...
})();
