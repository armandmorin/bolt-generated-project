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

    .widget-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .widget-body {
      padding: 16px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .widget-section {
      margin-bottom: 24px;
    }

    .widget-section:last-child {
      margin-bottom: 0;
    }

    .widget-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
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
      gap: 8px;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .feature-button:hover {
      background: #f1f5f9;
    }

    .feature-button.active {
      background: #e0e7ff;
      border-color: #818cf8;
      color: #4f46e5;
    }

    .feature-icon {
      font-size: 24px;
      line-height: 1;
    }

    .feature-button span:last-child {
      font-size: 12px;
      text-align: center;
      line-height: 1.2;
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

  // Widget state
  let isOpen = false;
  const features = {
    readableFont: false,
    readAllText: false,
    clickToSpeech: false,
    fontScaling: false,
    highlightLinks: false,
    highlightTitles: false,
    highContrast: false,
    lightContrast: false,
    darkContrast: false,
    monochrome: false,
    highSaturation: false,
    lowSaturation: false,
    muteSounds: false,
    hideImages: false,
    stopAnimations: false,
    highlightHover: false,
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
              <span>Click to Speech</span>
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
            <button class="feature-button" data-feature="stopAnimations">
              <span class="feature-icon">⛔</span>
              <span>Stop Animations</span>
            </button>
            <button class="feature-button" data-feature="highlightHover">
              <span class="feature-icon">🖱</span>
              <span>Highlight Hover</span>
            </button>
            <button class="feature-button" data-feature="bigCursor">
              <span class="feature-icon">➜</span>
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
  const featureButtons = widgetContainer.querySelectorAll('.feature-button');

  // Toggle widget
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
  });

  // Apply features
  function applyFeatures() {
    // Readable Font
    if (features.readableFont) {
      document.body.style.fontFamily = 'Arial, sans-serif';
      document.body.style.lineHeight = '1.6';
    }

    // Font Scaling
    if (features.fontScaling) {
      document.body.style.fontSize = '120%';
    }

    // Highlight Links
    if (features.highlightLinks) {
      document.querySelectorAll('a').forEach(link => {
        link.style.backgroundColor = '#ffff00';
        link.style.color = '#000000';
      });
    }

    // Highlight Titles
    if (features.highlightTitles) {
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(title => {
        title.style.backgroundColor = '#e0e7ff';
      });
    }

    // High Contrast
    if (features.highContrast) {
      document.body.style.filter = 'contrast(150%)';
    }

    // Dark Contrast
    if (features.darkContrast) {
      document.body.style.filter = 'brightness(80%)';
    }

    // Light Contrast
    if (features.lightContrast) {
      document.body.style.filter = 'brightness(120%)';
    }

    // Monochrome
    if (features.monochrome) {
      document.body.style.filter = 'grayscale(100%)';
    }

    // High Saturation
    if (features.highSaturation) {
      document.body.style.filter = 'saturate(150%)';
    }

    // Low Saturation
    if (features.lowSaturation) {
      document.body.style.filter = 'saturate(50%)';
    }

    // Hide Images
    if (features.hideImages) {
      document.querySelectorAll('img').forEach(img => {
        img.style.display = 'none';
      });
    }

    // Stop Animations
    if (features.stopAnimations) {
      document.body.style.animationPlayState = 'paused';
      document.body.style.transition = 'none';
    }

    // Highlight Hover
    if (features.highlightHover) {
      document.querySelectorAll('a, button').forEach(element => {
        element.style.transition = 'all 0.2s ease';
        element.addEventListener('mouseenter', () => {
          element.style.backgroundColor = '#e0e7ff';
        });
        element.addEventListener('mouseleave', () => {
          element.style.backgroundColor = '';
        });
      });
    }

    // Big Cursor
    if (features.bigCursor) {
      document.body.style.cursor = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRMMjQgMzZMMzYgMjRMMjQgMTJMMTIgMjRaIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==) 24 24, auto';
    }
  }

  // Reset features
  function resetFeatures() {
    document.body.style = '';
    document.querySelectorAll('a, button, h1, h2, h3, h4, h5, h6, img').forEach(element => {
      element.style = '';
    });
  }

  // Handle feature button clicks
  featureButtons.forEach(button => {
    button.addEventListener('click', () => {
      const feature = button.dataset.feature;
      features[feature] = !features[feature];
      button.classList.toggle('active', features[feature]);

      resetFeatures();
      applyFeatures();
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
