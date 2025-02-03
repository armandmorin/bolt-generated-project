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
        <button aria-label="Accessibility Options">♿</button>
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
            <button class="feature-button" data-feature="highContrast">
              <span class="feature-icon">◐</span>
              <span class="feature-text">High Contrast</span>
            </button>
            <button class="feature-button" data-feature="largeText">
              <span class="feature-icon">A+</span>
              <span class="feature-text">Large Text</span>
            </button>
            <button class="feature-button" data-feature="highlightLinks">
              <span class="feature-icon">🔗</span>
              <span class="feature-text">Highlight Links</span>
            </button>
            <button class="feature-button" data-feature="textToSpeech">
              <span class="feature-icon">🔊</span>
              <span class="feature-text">Text to Speech</span>
            </button>
            <button class="feature-button" data-feature="dyslexiaFont">
              <span class="feature-icon">Dx</span>
              <span class="feature-text">Dyslexia Font</span>
            </button>
            <button class="feature-button" data-feature="cursorHighlight">
              <span class="feature-icon">👆</span>
              <span class="feature-text">Cursor Highlight</span>
            </button>
            <button class="feature-button" data-feature="invertColors">
              <span class="feature-icon">🔄</span>
              <span class="feature-text">Invert Colors</span>
            </button>
            <button class="feature-button" data-feature="reducedMotion">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">Reduced Motion</span>
            </button>
            <button class="feature-button" data-feature="focusMode">
              <span class="feature-icon">👀</span>
              <span class="feature-text">Focus Mode</span>
            </button>
            <button class="feature-button" data-feature="readingGuide">
              <span class="feature-icon">📏</span>
              <span class="feature-text">Reading Guide</span>
            </button>
            <button class="feature-button" data-feature="monochrome">
              <span class="feature-icon">⚫</span>
              <span class="feature-text">Monochrome</span>
            </button>
          </div>
        </div>
        <div class="widget-footer">
          Powered by Accessibility Widget
        </div>
      </div>
    `;
  }

  // Add widget styles
  const styles = document.createElement('style');
  styles.textContent = `
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
      background-color: #4169E1;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease;
      font-size: 24px;
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
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: none;
    }

    .widget-panel.open {
      display: block;
    }

    .widget-header {
      padding: 12px 16px;
      background: #4CAF50;
      color: white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .widget-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .widget-body {
      padding: 16px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 8px;
    }

    .feature-button {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      text-align: left;
      font-size: 14px;
    }

    .feature-button:hover {
      background: #e8e8e8;
    }

    .feature-button.active {
      background: #4CAF50;
      color: white;
      border-color: #45a049;
    }

    .feature-icon {
      margin-right: 8px;
      font-size: 16px;
      min-width: 24px;
      text-align: center;
    }

    .feature-text {
      flex: 1;
    }

    .widget-footer {
      padding: 12px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
    }

    #reading-guide {
      position: fixed;
      height: 40px;
      width: 100%;
      background-color: rgba(255, 255, 0, 0.2);
      pointer-events: none;
      z-index: 9999;
      transition: top 0.1s ease;
    }
  `;

  // Initialize widget
  function initWidget() {
    // Add styles
    document.head.appendChild(styles);

    // Create and add widget container
    const container = createWidgetContainer();
    container.innerHTML = createWidgetHTML();
    document.body.appendChild(container);

    // Add event listeners
    const toggle = container.querySelector('.widget-toggle button');
    const panel = container.querySelector('.widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    featureButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('active');
        const feature = button.dataset.feature;
        // Feature toggle logic remains the same
      });
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  // Load widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
