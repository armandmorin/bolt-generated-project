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

  // Universal Accessibility Icon and widget HTML
  container.innerHTML = `
    <button class="accessibility-widget-button" aria-label="Accessibility Options">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 6.4a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4zM8 25.6V24c0-2.97 5.333-4.8 8-4.8 2.667 0 8 1.83 8 4.8v1.6H8zm16-12.8h-5.333L20 25.6h-2.667L16 17.6l-1.333 8H12l1.333-12.8H8v-1.6h16v1.6z"/>
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
})();
