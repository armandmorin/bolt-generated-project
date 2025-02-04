// Only updating the loadSettings function in the file, everything else remains exactly the same

async function loadSettings() {
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

    // Get base URL from script src
    const scriptUrl = new URL(currentScript.src);
    const baseUrl = `${scriptUrl.protocol}//${scriptUrl.hostname}${scriptUrl.port ? ':' + scriptUrl.port : ''}`;
    
    console.log('Loading settings from:', baseUrl);

    const response = await fetch(`${baseUrl}/api/widget-settings?clientKey=${clientKey}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load widget settings: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response type, expected JSON');
    }

    const settings = await response.json();
    console.log('Loaded settings:', settings);

    if (settings) {
      updateStyles(settings);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}
