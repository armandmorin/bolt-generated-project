(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Validate required parameters
  if (!clientKey || !supabaseUrl || !supabaseKey) {
    console.error('Accessibility Widget: Missing required configuration');
    return;
  }

  console.log('Initializing widget with client key:', clientKey); // Debug log

  // Function to fetch settings from Supabase
  async function fetchSettings() {
    try {
      console.log('Fetching settings for client key:', clientKey); // Debug log

      const response = await fetch(
        `${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`,
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
      console.log('Received settings:', settings); // Debug log

      if (!settings || settings.length === 0) {
        throw new Error('No settings found for this client key');
      }

      // Return the first settings object with proper mapping
      return {
        headerColor: settings[0].header_color,
        headerTextColor: settings[0].header_text_color,
        buttonColor: settings[0].button_color,
        poweredByText: settings[0].powered_by_text,
        poweredByColor: settings[0].powered_by_color
      };
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      // Return default settings
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
    try {
      const settings = await fetchSettings();
      console.log('Initializing widget with settings:', settings); // Debug log

      // Create and append widget container
      const container = document.createElement('div');
      container.id = 'accessibility-widget-container';
      document.body.appendChild(container);

      // Add styles
      const styles = document.createElement('style');
      styles.textContent = `
        #accessibility-widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 99999;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .accessibility-widget-button {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${settings.buttonColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: transform 0.3s ease;
          padding: 0;
        }

        /* Rest of your styles... */
      `;
      document.head.appendChild(styles);

      // Add widget HTML
      container.innerHTML = `
        <button class="accessibility-widget-button" aria-label="Accessibility Options">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="m11.997 1.771h-.001c-5.647 0-10.226 4.578-10.226 10.226s4.578 10.226 10.226 10.226c5.647 0 10.226-4.578 10.226-10.226 0-5.647-4.578-10.225-10.225-10.226zm.198 2.252c.801 0 1.45.649 1.45 1.45s-.649 1.45-1.45 1.45-1.45-.649-1.45-1.45c0-.801.649-1.45 1.45-1.45zm5.307 3.668c-.087.117-.216.199-.364.223h-.003l-3.445.53c-.03.002-.056.017-.074.038-.018.022.343 4.274.343 4.274l1.958 5.337c.055.104.087.226.087.357 0 .295-.165.551-.407.681l-.004.002c-.074.033-.161.053-.253.053-.001 0-.001 0-.002 0-.33-.016-.608-.224-.728-.513l-.002-.006s-2.508-5.691-2.522-5.734c-.016-.047-.06-.081-.112-.081-.048 0-.088.031-.103.074v.001c-.014.041-2.522 5.734-2.522 5.734-.121.294-.399.501-.727.518h-.002c-.001 0-.001 0-.002 0-.091 0-.178-.019-.256-.054l.004.002c-.176-.08-.308-.229-.364-.411l-.001-.005c-.025-.078-.04-.168-.04-.261 0-.133.029-.258.082-.371l-.002.005s1.91-5.165 1.911-5.174l.355-4.363c0-.003 0-.006 0-.01 0-.054-.04-.099-.092-.107h-.001l-3.36-.52c-.271-.043-.475-.275-.475-.554 0-.31.251-.561.561-.561.03 0 .06.002.089.007h-.003l3.223.498h3.421c.007.002.015.003.024.003s.016-.001.024-.003h-.001l3.244-.497c.024-.004.052-.006.08-.006.28 0 .513.203.56.47v.003c.004.026.007.057.007.088 0 .124-.04.238-.109.33l.001-.002z"/>
          </svg>
        </button>
      `;

      console.log('Widget initialized successfully'); // Debug log
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  // Initialize the widget
  initWidget();
})();
