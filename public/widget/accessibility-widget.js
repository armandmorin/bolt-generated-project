(function() {
  // Create widget container
  function createWidgetContainer() {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    return container;
  }

  // Create widget HTML
  function createWidgetHTML() {
    return `
      <div class="widget-toggle">
        <button aria-label="Accessibility Options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
          </svg>
        </button>
      </div>
      <div class="widget-panel">
        <div class="widget-header">
          <h3>Accessibility Settings</h3>
        </div>
        <div class="widget-body">
          <div class="feature-grid">
            <button class="feature-button" data-feature="readableFont">
              <span class="feature-icon">Aa</span>
              <span class="feature-text">Readable Font</span>
            </button>
            <button class="feature-button" data-feature="contrast">
              <span class="feature-icon">🎨</span>
              <span class="feature-text">High Contrast</span>
            </button>
            <!-- Add more features as needed -->
          </div>
        </div>
        <div class="widget-footer">
          Powered by Accessibility Widget
        </div>
      </div>
    `;
  }

  // Add widget styles
  function addWidgetStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      #accessibility-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
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
      }

      .widget-toggle button:hover {
        transform: scale(1.1);
      }

      .widget-panel {
        position: absolute;
        bottom: calc(100% + 16px);
        right: 0;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
      }

      .widget-panel.open {
        display: block;
      }

      .widget-header {
        padding: 16px;
        background: #60a5fa;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }

      .widget-header h3 {
        margin: 0;
        color: white;
        font-size: 16px;
        font-weight: 500;
      }

      .widget-body {
        padding: 16px;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .feature-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .feature-button:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      .feature-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .feature-text {
        font-size: 12px;
        text-align: center;
        color: #475569;
      }

      .widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
      }
    `;
    document.head.appendChild(styles);
  }

  // Initialize widget
  function initWidget() {
    // Create container
    const container = createWidgetContainer();
    container.innerHTML = createWidgetHTML();
    document.body.appendChild(container);

    // Add styles
    addWidgetStyles();

    // Add event listeners
    const toggle = container.querySelector('.widget-toggle button');
    const panel = container.querySelector('.widget-panel');
    
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    // Feature buttons functionality
    const featureButtons = container.querySelectorAll('.feature-button');
    featureButtons.forEach(button => {
      button.addEventListener('click', () => {
        const feature = button.dataset.feature;
        button.classList.toggle('active');
        // Add feature-specific functionality here
      });
    });
  }

  // Load widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
