(function() {
  // Get settings from localStorage
  const widgetSettings = JSON.parse(localStorage.getItem('widgetSettings')) || {
    headerColor: '#60a5fa',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b'
  };

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'accessibility-widget-container';
  document.body.appendChild(widgetContainer);

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    /* ... (previous styles remain the same until feature-icon) ... */

    .feature-icon {
      font-size: 24px;
      line-height: 1;
      margin-bottom: 8px;
      color: #1e293b; /* Almost black color for icons */
    }

    /* Specific colored icons */
    .feature-icon.moon {
      color: #fbbf24; /* Yellow for moon */
    }

    .feature-icon.sun {
      color: #fbbf24; /* Yellow for sun */
    }

    .feature-icon.water {
      color: #3b82f6; /* Blue for water drop */
    }

    /* ... (rest of the styles remain the same) ... */
  `;
  document.head.appendChild(styles);

  // Create widget HTML
  widgetContainer.innerHTML = `
    <button class="widget-toggle" aria-label="Accessibility Options">
      <svg class="widget-toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 7v2h18V7H3zm3 4v8h2v-6h4v6h2V11H6zm14 0h-6v2h6v-2zm0 4h-6v2h6v-2z"/>
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
              <span class="feature-text">Readable Font</span>
            </button>
            <button class="feature-button" data-feature="readAllText">
              <span class="feature-icon">▶</span>
              <span class="feature-text">Read All Text</span>
            </button>
            <button class="feature-button" data-feature="clickToSpeech">
              <span class="feature-icon">🎧</span>
              <span class="feature-text">Turn on Click to Speech</span>
            </button>
            <button class="feature-button" data-feature="fontScaling">
              <span class="feature-icon">T↕</span>
              <span class="feature-text">Font Scaling</span>
            </button>
            <button class="feature-button" data-feature="highlightLinks">
              <span class="feature-icon">🔗</span>
              <span class="feature-text">Highlight Links</span>
            </button>
            <button class="feature-button" data-feature="highlightTitles">
              <span class="feature-icon">H</span>
              <span class="feature-text">Highlight Titles</span>
            </button>
          </div>
        </div>

        <div class="widget-section">
          <h4>Color Adjustments</h4>
          <div class="feature-grid">
            <button class="feature-button" data-feature="highContrast">
              <span class="feature-icon">◐</span>
              <span class="feature-text">High Contrast</span>
            </button>
            <button class="feature-button" data-feature="lightContrast">
              <span class="feature-icon sun">☀</span>
              <span class="feature-text">Light Contrast</span>
            </button>
            <button class="feature-button" data-feature="darkContrast">
              <span class="feature-icon moon">🌙</span>
              <span class="feature-text">Dark Contrast</span>
            </button>
            <button class="feature-button" data-feature="monochrome">
              <span class="feature-icon">◑</span>
              <span class="feature-text">Monochrome</span>
            </button>
            <button class="feature-button" data-feature="highSaturation">
              <span class="feature-icon">⚛</span>
              <span class="feature-text">High Saturation</span>
            </button>
            <button class="feature-button" data-feature="lowSaturation">
              <span class="feature-icon water">💧</span>
              <span class="feature-text">Low Saturation</span>
            </button>
          </div>
        </div>

        <div class="widget-section">
          <h4>Orientation Adjustments</h4>
          <div class="feature-grid">
            <button class="feature-button" data-feature="muteSounds">
              <span class="feature-icon">🔇</span>
              <span class="feature-text">Mute Sounds</span>
            </button>
            <button class="feature-button" data-feature="hideImages">
              <span class="feature-icon">🖼</span>
              <span class="feature-text">Hide Images</span>
            </button>
          </div>
        </div>
      </div>
      <div class="widget-footer" style="color: ${widgetSettings.poweredByColor}">
        ${widgetSettings.poweredByText}
      </div>
    </div>
  `;

  // ... (rest of the JavaScript remains the same) ...

})();
