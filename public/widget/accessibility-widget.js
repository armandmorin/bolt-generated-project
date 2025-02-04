// Update only the initWidget function, rest remains the same
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

    // Get the widget script URL to extract the base URL
    const scriptUrl = new URL(currentScript.src);
    const baseUrl = `${scriptUrl.protocol}//${scriptUrl.hostname}${scriptUrl.port ? ':' + scriptUrl.port : ''}`;

    // Use the base URL for the API endpoint
    const response = await fetch(`${baseUrl}/api/widget-settings?clientKey=${clientKey}`);

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
