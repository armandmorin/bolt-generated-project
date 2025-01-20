(function() {
  // Get domain from localStorage (set by super admin)
  const WIDGET_URL = localStorage.getItem('widgetDomain') || window.location.origin;
  const CLIENT_KEY = document.currentScript.getAttribute('data-client-key');
  
  // Initialize settings with defaults
  let widgetSettings = {
    headerColor: '#2563eb',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#666666',
    version: 1
  };

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
      width: 64px;
      height: 64px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background-color: ${widgetSettings.buttonColor};
      color: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .widget-toggle svg {
      width: 32px;
      height: 32px;
      fill: white;
    }

    .widget-toggle:hover {
      transform: scale(1.1);
    }

    .widget-panel {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: none;
    }

    .widget-panel.open {
      display: block;
    }

    .widget-header {
      padding: 20px;
      background-color: ${widgetSettings.headerColor};
      color: #1e293b;
    }

    .widget-header h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
    }

    .widget-body {
      padding: 24px;
    }

    .widget-section {
      margin-bottom: 32px;
    }

    .widget-section:last-child {
      margin-bottom: 0;
    }

    .widget-section h4 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .feature-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 100px;
    }

    .feature-button:hover {
      background: #f1f5f9;
    }

    .feature-button.active {
      background: #e0e7ff;
      border-color: #818cf8;
    }

    .feature-icon {
      font-size: 24px;
      line-height: 1;
      margin-bottom: 8px;
    }

    .feature-button span:last-child {
      font-size: 14px;
      text-align: center;
      line-height: 1.4;
      color: #1e293b;
    }

    .widget-footer {
      padding: 16px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
    }
  `;
  document.head.appendChild(styles);

  // Create widget HTML
  widgetContainer.innerHTML = `
    <button class="widget-toggle" aria-label="Accessibility Options">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M12 8a2 2 0 100-4 2 2 0 000 4z"/>
        <path d="M12 8v8"/>
        <path d="M8 14h8"/>
      </svg>
    </button>
    <div class="widget-panel">
      <div class="widget-header">
        <h3>Accessibility Settings</h3>
      </div>
      <div class="widget-body">
        <div class="widget-section">
          <h4>Content Adjustments</h4>
          <div class="feature-grid">
            <button class="feature-button" data-feature="readableFont">
              <span class="feature-icon">Aa</span>
              <span>Readable Font</span>
            </button>
            <button class="feature-button" data-feature="readAllText">
              <span class="feature-icon">▶</span>
              <span>Read All Text</span>
            </button>
            <button class="feature-button" data-feature="clickToSpeech">
              <span class="feature-icon">🎧</span>
              <span>Turn on Click to Speech</span>
            </button>
            <button class="feature-button" data-feature="fontScaling">
              <span class="feature-icon">T↕</span>
              <span>Font Scaling</span>
            </button>
            <button class="feature-button" data-feature="highlightLinks">
              <span class="feature-icon">🔗</span>
              <span>Highlight Links</span>
            </button>
            <button class="feature-button" data-feature="highlightTitles">
              <span class="feature-icon">H</span>
              <span>Highlight Titles</span>
            </button>
          </div>
        </div>

        <div class="widget-section">
          <h4>Color Adjustments</h4>
          <div class="feature-grid">
            <button class="feature-button" data-feature="highContrast">
              <span class="feature-icon">◐</span>
              <span>High Contrast</span>
            </button>
            <button class="feature-button" data-feature="lightContrast">
              <span class="feature-icon">☀</span>
              <span>Light Contrast</span>
            </button>
            <button class="feature-button" data-feature="darkContrast">
              <span class="feature-icon">🌙</span>
              <span>Dark Contrast</span>
            </button>
            <button class="feature-button" data-feature="monochrome">
              <span class="feature-icon">◑</span>
              <span>Monochrome</span>
            </button>
            <button class="feature-button" data-feature="highSaturation">
              <span class="feature-icon">⚛</span>
              <span>High Saturation</span>
            </button>
            <button class="feature-button" data-feature="lowSaturation">
              <span class="feature-icon">💧</span>
              <span>Low Saturation</span>
            </button>
          </div>
        </div>

        <div class="widget-section">
          <h4>Orientation Adjustments</h4>
          <div class="feature-grid">
            <button class="feature-button" data-feature="muteSounds">
              <span class="feature-icon">🔇</span>
              <span>Mute Sounds</span>
            </button>
            <button class="feature-button" data-feature="hideImages">
              <span class="feature-icon">🖼</span>
              <span>Hide Images</span>
            </button>
          </div>
        </div>
      </div>
      <div class="widget-footer">
        ${widgetSettings.poweredByText}
      </div>
    </div>
  `;

  // Rest of the JavaScript functionality remains the same...
  // (Event handlers, feature application, etc.)

})();
