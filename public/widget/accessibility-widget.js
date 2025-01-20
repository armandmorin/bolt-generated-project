(function() {
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'accessibility-widget-container';
  document.body.appendChild(widgetContainer);

  // Default settings
  const widgetSettings = {
    headerColor: '#60a5fa',
    headerTextColor: '#1e293b',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b'
  };

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

    .widget-toggle:hover {
      transform: scale(1.1);
    }

    .widget-toggle-icon {
      width: 32px;
      height: 32px;
    }

    .widget-panel {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 320px;
      height: 600px;
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
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .widget-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: ${widgetSettings.headerTextColor};
    }

    .widget-body {
      padding: 24px;
      height: calc(600px - 57px - 49px);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }

    .widget-body::-webkit-scrollbar {
      width: 8px;
    }

    .widget-body::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .widget-body::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
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
      text-align: center;
      width: 100%;
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
      color: #1e293b;
    }

    .feature-text {
      font-size: 14px;
      line-height: 1.4;
      color: #1e293b;
    }

    .widget-footer {
      padding: 16px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
      color: ${widgetSettings.poweredByColor};
      position: sticky;
      bottom: 0;
      background: white;
      z-index: 1;
    }
  `;
  document.head.appendChild(styles);

  // Create widget HTML
  widgetContainer.innerHTML = `
    <button class="widget-toggle" aria-label="Accessibility Options">
      <svg class="widget-toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 6v8M8 10h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
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
              <span class="feature-icon">☀</span>
              <span class="feature-text">Light Contrast</span>
            </button>
            <button class="feature-button" data-feature="darkContrast">
              <span class="feature-icon">🌙</span>
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
              <span class="feature-icon">💧</span>
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
      <div class="widget-footer">
        ${widgetSettings.poweredByText}
      </div>
    </div>
  `;

  // Initialize state
  let isOpen = false;
  const features = {};

  // Get elements
  const toggle = widgetContainer.querySelector('.widget-toggle');
  const panel = widgetContainer.querySelector('.widget-panel');
  const buttons = widgetContainer.querySelectorAll('.feature-button');

  // Toggle widget
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
  });

  // Handle feature buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const feature = button.dataset.feature;
      features[feature] = !features[feature];
      button.classList.toggle('active', features[feature]);
      applyFeature(feature, features[feature]);
    });
  });

  // Apply feature function
  function applyFeature(feature, isActive) {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = isActive ? 'Arial, sans-serif' : '';
        document.body.style.lineHeight = isActive ? '1.6' : '';
        break;
      case 'fontScaling':
        document.body.style.fontSize = isActive ? '120%' : '';
        break;
      case 'highlightLinks':
        document.querySelectorAll('a').forEach(link => {
          link.style.backgroundColor = isActive ? '#ffff00' : '';
          link.style.color = isActive ? '#000000' : '';
        });
        break;
      case 'highlightTitles':
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(title => {
          title.style.backgroundColor = isActive ? '#e0e7ff' : '';
        });
        break;
      case 'highContrast':
        document.body.style.filter = isActive ? 'contrast(150%)' : '';
        break;
      case 'lightContrast':
        document.body.style.filter = isActive ? 'brightness(120%)' : '';
        break;
      case 'darkContrast':
        document.body.style.filter = isActive ? 'brightness(80%)' : '';
        break;
      case 'monochrome':
        document.body.style.filter = isActive ? 'grayscale(100%)' : '';
        break;
      case 'highSaturation':
        document.body.style.filter = isActive ? 'saturate(150%)' : '';
        break;
      case 'lowSaturation':
        document.body.style.filter = isActive ? 'saturate(50%)' : '';
        break;
      case 'hideImages':
        document.querySelectorAll('img').forEach(img => {
          img.style.display = isActive ? 'none' : '';
        });
        break;
    }
  }

  // Close widget when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !widgetContainer.contains(e.target)) {
      isOpen = false;
      panel.classList.remove('open');
    }
  });
})();
