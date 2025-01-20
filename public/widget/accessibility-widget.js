(function() {
  // Get settings from script attributes
  const script = document.currentScript;
  const settings = {
    headerColor: script.getAttribute('data-header-color') || '#60a5fa',
    headerTextColor: script.getAttribute('data-header-text-color') || '#1e293b',
    buttonColor: script.getAttribute('data-button-color') || '#2563eb',
    poweredByText: script.getAttribute('data-powered-by-text') || 'Powered by Accessibility Widget',
    poweredByColor: script.getAttribute('data-powered-by-color') || '#64748b'
  };

  // Create and append widget container
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  document.body.appendChild(container);

  // Updated Universal Accessibility Icon and widget HTML
  container.innerHTML = `
    <button class="accessibility-widget-button" aria-label="Accessibility Options">
      <svg width="32" height="32" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="10"/>
        <path d="M50 18 C 50 18, 32 35, 32 50 C 32 65, 50 82, 50 82 C 50 82, 68 65, 68 50 C 68 35, 50 18, 50 18" fill="currentColor"/>
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

  // Add styles with customization
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
  document.head.appendChild(styles);

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

  // Check for updates every 5 seconds
  setInterval(() => {
    const newSettings = {
      headerColor: script.getAttribute('data-header-color'),
      headerTextColor: script.getAttribute('data-header-text-color'),
      buttonColor: script.getAttribute('data-button-color'),
      poweredByText: script.getAttribute('data-powered-by-text'),
      poweredByColor: script.getAttribute('data-powered-by-color')
    };

    // Update if settings have changed
    if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
      Object.assign(settings, newSettings);
      // Update styles
      styles.textContent = styles.textContent.replace(/background: [^;]+;/, `background: ${settings.buttonColor};`)
        .replace(/background: [^;]+;/, `background: ${settings.headerColor};`)
        .replace(/color: [^;]+;/, `color: ${settings.headerTextColor};`);
      // Update footer text
      container.querySelector('.accessibility-widget-footer').textContent = settings.poweredByText;
      container.querySelector('.accessibility-widget-footer').style.color = settings.poweredByColor;
    }
  }, 5000);
})();
