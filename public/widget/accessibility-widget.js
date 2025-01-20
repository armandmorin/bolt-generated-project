(function() {
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'accessibility-widget-container';
  document.body.appendChild(widgetContainer);

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    #accessibility-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .widget-toggle {
      width: 48px;
      height: 48px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background-color: #2563eb;
      color: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .widget-toggle:hover {
      transform: scale(1.1);
    }

    .widget-panel {
      position: absolute;
      bottom: 60px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: none;
    }

    .widget-panel.open {
      display: block;
    }

    .widget-header {
      padding: 16px;
      background-color: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .widget-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .widget-logo {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .widget-body {
      padding: 16px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .widget-section {
      margin-bottom: 24px;
    }

    .widget-section h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }

    .widget-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .widget-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .widget-button:hover {
      background: #f1f5f9;
    }

    .widget-button.active {
      background: #e0e7ff;
      border-color: #818cf8;
      color: #4f46e5;
    }

    .widget-footer {
      padding: 12px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #e2e8f0;
    }
  `;
  document.head.appendChild(styles);

  // Widget state
  let isOpen = false;
  const settings = {
    fontSize: 'normal',
    contrast: 'normal',
    highlightLinks: false,
    textToSpeech: false,
    readableFont: false,
    stopAnimations: false,
    bigCursor: false
  };

  // Create widget HTML
  widgetContainer.innerHTML = `
    <button class="widget-toggle" aria-label="Accessibility Options">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
      </svg>
    </button>
    <div class="widget-panel">
      <div class="widget-header">
        <h2>Accessibility Settings</h2>
      </div>
      <div class="widget-body">
        <div class="widget-section">
          <h3>Content Adjustments</h3>
          <div class="widget-buttons">
            <button class="widget-button" data-action="readableFont">
              <span>Readable Font</span>
            </button>
            <button class="widget-button" data-action="highlightLinks">
              <span>Highlight Links</span>
            </button>
            <button class="widget-button" data-action="textToSpeech">
              <span>Text-to-Speech</span>
            </button>
            <button class="widget-button" data-action="stopAnimations">
              <span>Stop Animations</span>
            </button>
          </div>
        </div>
        <div class="widget-section">
          <h3>Visual Adjustments</h3>
          <div class="widget-buttons">
            <button class="widget-button" data-action="fontSize" data-value="large">
              <span>Large Text</span>
            </button>
            <button class="widget-button" data-action="contrast" data-value="high">
              <span>High Contrast</span>
            </button>
            <button class="widget-button" data-action="bigCursor">
              <span>Big Cursor</span>
            </button>
          </div>
        </div>
      </div>
      <div class="widget-footer">
        Powered by Accessibility Widget
      </div>
    </div>
  `;

  // Get elements
  const toggle = widgetContainer.querySelector('.widget-toggle');
  const panel = widgetContainer.querySelector('.widget-panel');
  const buttons = widgetContainer.querySelectorAll('.widget-button');

  // Toggle widget
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
  });

  // Apply settings
  function applySettings() {
    // Font size
    document.body.style.fontSize = settings.fontSize === 'large' ? '1.25rem' : '1rem';

    // Contrast
    if (settings.contrast === 'high') {
      document.body.style.filter = 'contrast(150%)';
    } else {
      document.body.style.filter = '';
    }

    // Readable font
    if (settings.readableFont) {
      document.body.style.fontFamily = 'Arial, sans-serif';
      document.body.style.lineHeight = '1.6';
    } else {
      document.body.style.fontFamily = '';
      document.body.style.lineHeight = '';
    }

    // Highlight links
    document.querySelectorAll('a').forEach(link => {
      link.style.backgroundColor = settings.highlightLinks ? '#ffff00' : '';
      link.style.padding = settings.highlightLinks ? '2px' : '';
    });

    // Stop animations
    if (settings.stopAnimations) {
      document.body.style.animationPlayState = 'paused';
      document.body.style.transition = 'none';
    } else {
      document.body.style.animationPlayState = '';
      document.body.style.transition = '';
    }

    // Big cursor
    document.body.style.cursor = settings.bigCursor ? 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRMMjQgMzZMMzYgMjRMMjQgMTJMMTIgMjRaIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==) 24 24, auto' : '';
  }

  // Handle button clicks
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const value = button.dataset.value;

      // Update settings
      if (value) {
        settings[action] = value;
      } else {
        settings[action] = !settings[action];
      }

      // Update button state
      button.classList.toggle('active', settings[action]);

      // Apply settings
      applySettings();
    });
  });

  // Close widget when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !widgetContainer.contains(e.target)) {
      isOpen = false;
      panel.classList.remove('open');
    }
  });
})();
