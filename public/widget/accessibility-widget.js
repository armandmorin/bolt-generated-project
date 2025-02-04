(function() {
  // Create widget immediately with loading state
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  
  // Add initial styles immediately
  const initialStyles = document.createElement('style');
  initialStyles.textContent = `
    #accessibility-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .widget-toggle button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background-color: #2563eb;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease;
      padding: 0;
    }

    .widget-toggle .widget-icon {
      width: 32px;
      height: 32px;
      color: white;
    }
  `;
  document.head.appendChild(initialStyles);

  // Add initial HTML
  container.innerHTML = `
    <div class="widget-toggle">
      <button aria-label="Accessibility Options">
        <svg viewBox="0 0 122.88 122.88" class="widget-icon">
          <path fill="currentColor" d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"/>
        </svg>
      </button>
    </div>
  `;

  // Add to page immediately
  document.body.appendChild(container);

  // Then load settings and update
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

      // Use the script's origin for the API endpoint
      const scriptUrl = new URL(currentScript.src);
      const baseUrl = scriptUrl.origin;
      console.log('Fetching settings from:', baseUrl);

      const response = await fetch(`${baseUrl}/api/widget-settings?clientKey=${clientKey}`);

      if (!response.ok) {
        throw new Error('Failed to load widget settings');
      }

      const settings = await response.json();
      if (settings) {
        updateWidget(settings);
      }
    } catch (error) {
      console.error('Error loading widget settings:', error);
    }
  }

  // Rest of your existing code (createWidgetHTML, handleFeatureToggle, etc.)
  // ... 

  // Start loading settings
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
  } else {
    loadSettings();
  }
})();
