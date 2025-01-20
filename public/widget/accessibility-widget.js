(function() {
  // Get settings from localStorage
  function getSettings() {
    try {
      const savedSettings = localStorage.getItem('widgetSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (e) {
      console.error('Error reading widget settings:', e);
    }
    return {
      headerColor: '#60a5fa',
      headerTextColor: '#1e293b',
      buttonColor: '#2563eb',
      poweredByText: 'Powered by Accessibility Widget',
      poweredByColor: '#64748b'
    };
  }

  // Initialize settings
  let settings = getSettings();

  // Create and append widget container
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  document.body.appendChild(container);

  // Widget HTML with accessibility icon
  container.innerHTML = `
    <button class="accessibility-widget-button" aria-label="Accessibility Options">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="m11.997 1.771h-.001c-5.647 0-10.226 4.578-10.226 10.226s4.578 10.226 10.226 10.226c5.647 0 10.226-4.578 10.226-10.226 0-5.647-4.578-10.225-10.225-10.226zm.198 2.252c.801 0 1.45.649 1.45 1.45s-.649 1.45-1.45 1.45-1.45-.649-1.45-1.45c0-.801.649-1.45 1.45-1.45zm5.307 3.668c-.087.117-.216.199-.364.223h-.003l-3.445.53c-.03.002-.056.017-.074.038-.018.022.343 4.274.343 4.274l1.958 5.337c.055.104.087.226.087.357 0 .295-.165.551-.407.681l-.004.002c-.074.033-.161.053-.253.053-.001 0-.001 0-.002 0-.33-.016-.608-.224-.728-.513l-.002-.006s-2.508-5.691-2.522-5.734c-.016-.047-.06-.081-.112-.081-.048 0-.088.031-.103.074v.001c-.014.041-2.522 5.734-2.522 5.734-.121.294-.399.501-.727.518h-.002c-.001 0-.001 0-.002 0-.091 0-.178-.019-.256-.054l.004.002c-.176-.08-.308-.229-.364-.411l-.001-.005c-.025-.078-.04-.168-.04-.261 0-.133.029-.258.082-.371l-.002.005s1.91-5.165 1.911-5.174l.355-4.363c0-.003 0-.006 0-.01 0-.054-.04-.099-.092-.107h-.001l-3.36-.52c-.271-.043-.475-.275-.475-.554 0-.31.251-.561.561-.561.03 0 .06.002.089.007h-.003l3.223.498h3.421c.007.002.015.003.024.003s.016-.001.024-.003h-.001l3.244-.497c.024-.004.052-.006.08-.006.28 0 .513.203.56.47v.003c.004.026.007.057.007.088 0 .124-.04.238-.109.33l.001-.002z"/>
        <path d="m12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22.975c-.001 0-.003 0-.004 0-6.064 0-10.979-4.916-10.979-10.979s4.916-10.979 10.979-10.979c6.064 0 10.979 4.916 10.979 10.979v.004c-.002 6.061-4.915 10.973-10.975 10.975z"/>
      </svg>
    </button>
    <div class="accessibility-widget-panel">
      <div class="accessibility-widget-header">
        <h3>Accessibility Settings</h3>
      </div>
      <div class="accessibility-widget-content">
        <!-- Widget content here -->
      </div>
      <div class="accessibility-widget-footer">
        ${settings.poweredByText}
      </div>
    </div>
  `;

  function updateStyles() {
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

      .accessibility-widget-button svg {
        width: 40px;
        height: 40px;
      }

      .accessibility-widget-button:hover {
        transform: scale(1.1);
      }

      .accessibility-widget-panel {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 320px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      .accessibility-widget-header {
        padding: 16px;
        background: ${settings.headerColor};
        border-radius: 8px 8px 0 0;
      }

      .accessibility-widget-header h3 {
        margin: 0;
        color: ${settings.headerTextColor};
        font-size: 18px;
      }

      .accessibility-widget-content {
        padding: 16px;
      }

      .accessibility-widget-footer {
        padding: 16px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
        color: ${settings.poweredByColor};
        font-size: 14px;
      }
    `;
    
    // Remove old styles if they exist
    const oldStyles = document.getElementById('accessibility-widget-styles');
    if (oldStyles) {
      oldStyles.remove();
    }
    
    styles.id = 'accessibility-widget-styles';
    document.head.appendChild(styles);
    
    // Update footer text and color
    const footer = container.querySelector('.accessibility-widget-footer');
    if (footer) {
      footer.textContent = settings.poweredByText;
      footer.style.color = settings.poweredByColor;
    }

    // Update button color
    const button = container.querySelector('.accessibility-widget-button');
    if (button) {
      button.style.backgroundColor = settings.buttonColor;
    }

    // Update header
    const header = container.querySelector('.accessibility-widget-header');
    if (header) {
      header.style.backgroundColor = settings.headerColor;
    }

    // Update header text color
    const headerText = container.querySelector('.accessibility-widget-header h3');
    if (headerText) {
      headerText.style.color = settings.headerTextColor;
    }
  }

  // Initial styles
  updateStyles();

  // Basic functionality
  const button = container.querySelector('.accessibility-widget-button');
  const panel = container.querySelector('.accessibility-widget-panel');

  button.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Check for updates every second
  setInterval(() => {
    const newSettings = getSettings();
    if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
      settings = newSettings;
      updateStyles();
    }
  }, 1000);
})();
