// Update the fetch URL in the initWidget function
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

    // Get the base URL from the script src
    const scriptUrl = new URL(currentScript.src);
    const baseUrl = `${scriptUrl.protocol}//${scriptUrl.host}`;

    // Updated URL format
    const response = await fetch(`${baseUrl}/api/widget-settings?clientKey=${clientKey}`);

    if (!response.ok) {
      throw new Error('Failed to load widget settings');
    }

    const settings = await response.json();
    if (settings) {
      globalSettings = settings;
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
