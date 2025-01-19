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
        }

        .widget-body {
          padding: 16px;
        }

        .widget-section {
          margin-bottom: 16px;
        }

        .widget-section h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #1e293b;
        }

        .widget-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .widget-button {
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .widget-button:hover {
          background: #f8fafc;
        }

        .widget-button.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .widget-footer {
          padding: 12px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
        }
      `;
      document.head.appendChild(styles);

      // Widget state
      let isOpen = false;
      const settings = {
        fontSize: 'normal',
        contrast: 'normal',
        links: false,
        cursor: false
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
              <h3>Text Size</h3>
              <div class="widget-buttons">
                <button class="widget-button active" data-action="fontSize" data-value="normal">Normal</button>
                <button class="widget-button" data-action="fontSize" data-value="large">Large</button>
              </div>
            </div>
            <div class="widget-section">
              <h3>Contrast</h3>
              <div class="widget-buttons">
                <button class="widget-button active" data-action="contrast" data-value="normal">Normal</button>
                <button class="widget-button" data-action="contrast" data-value="high">High Contrast</button>
              </div>
            </div>
            <div class="widget-section">
              <h3>Accessibility</h3>
              <div class="widget-buttons">
                <button class="widget-button" data-action="links" data-value="highlight">Highlight Links</button>
                <button class="widget-button" data-action="cursor" data-value="large">Large Cursor</button>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            Powered by Your Company
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
        document.body.style.fontSize = settings.fontSize === 'large' ? '120%' : '';

        // Contrast
        if (settings.contrast === 'high') {
          document.body.style.filter = 'contrast(150%)';
        } else {
          document.body.style.filter = '';
        }

        // Links
        document.querySelectorAll('a').forEach(link => {
          link.style.textDecoration = settings.links ? 'underline' : '';
          link.style.backgroundColor = settings.links ? '#ff0' : '';
        });

        // Cursor
        document.body.style.cursor = settings.cursor ? 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRMMjQgMzZMMzYgMjRMMjQgMTJMMTIgMjRaIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==) 24 24, auto' : '';
      }

      // Handle button clicks
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const action = button.dataset.action;
          const value = button.dataset.value;

          // Update buttons in the same group
          const group = button.closest('.widget-buttons');
          group.querySelectorAll('.widget-button').forEach(btn => {
            btn.classList.remove('active');
          });
          button.classList.add('active');

          // Update settings
          if (action === 'fontSize' || action === 'contrast') {
            settings[action] = value;
          } else {
            settings[action] = !settings[action];
            button.classList.toggle('active', settings[action]);
          }

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
