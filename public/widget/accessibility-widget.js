(function() {
  // Get settings from current script tag
  const currentScript = document.currentScript;
  let settings = {
    headerColor: currentScript?.getAttribute('data-header-color'),
    headerTextColor: currentScript?.getAttribute('data-header-text-color'),
    buttonColor: currentScript?.getAttribute('data-button-color'),
    poweredByText: currentScript?.getAttribute('data-powered-by-text'),
    poweredByColor: currentScript?.getAttribute('data-powered-by-color')
  };

  // Use default values if attributes are not set
  settings = {
    headerColor: settings.headerColor || '#60a5fa',
    headerTextColor: settings.headerTextColor || '#1e293b',
    buttonColor: settings.buttonColor || '#2563eb',
    poweredByText: settings.poweredByText || 'Powered by Accessibility Widget',
    poweredByColor: settings.poweredByColor || '#64748b'
  };

  // Create and append widget container
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  document.body.appendChild(container);

  // Widget HTML with accessibility icon
  container.innerHTML = `
    <button class="accessibility-widget-button" aria-label="Accessibility Options">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="m11.997 1.771h-.001c-5.647 0-10.226 4.578-10.226 10.226s4.578 10.226 10.226 10.226c5.647 0 10.226-4.578 10.226-10.226 0-5.647-4.578-10.225-10.225-10.226zm.198 2.252c.801 0 1.45.649 1.45 1.45s-.649 1.45-1.45 1.45-1.45-.649-1.45-1.45c0-.801.649-1.45 1.45-1.45zm5.307 3.668c-.087.117-.216.199-.364.223h-.003l-3.445.53c-.03.002-.056.017-.074.038-.018.022.343 4.274.343 4.274l1.958 5.337c.055.104.087.226.087.357 0 .295-.165.551-.407.681l-.004.002c-.074.033-.161.053-.253.053-.001 0-.001 0-.002 0-.33-.016-.608-.224-.728-.513l-.002-.006s-2.508-5.691-2.522-5.734c-.016-.047-.06-.081-.112-.081-.048 0-.088.031-.103.074v.001c-.014.041-2.522 5.734-2.522 5.734-.121.294-.399.501-.727.518h-.002c-.001 0-.001 0-.002 0-.091 0-.178-.019-.256-.054l.004.002c-.176-.08-.308-.229-.364-.411l-.001-.005c-.025-.078-.04-.168-.04-.261 0-.133.029-.258.082-.371l-.002.005s1.91-5.165 1.911-5.174l.355-4.363c0-.003 0-.006 0-.01 0-.054-.04-.099-.092-.107h-.001l-3.36-.52c-.271-.043-.475-.275-.475-.554 0-.31.251-.561.561-.561.03 0 .06.002.089.007h-.003l3.223.498h3.421c.007.002.015.003.024.003s.016-.001.024-.003h-.001l3.244-.497c.024-.004.052-.006.08-.006.28 0 .513.203.56.47v.003c.004.026.007.057.007.088 0 .124-.04.238-.109.33l.001-.002z"/>
        <path d="m12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22.975c-.001 0-.003 0-.004 0-6.064 0-10.979-4.916-10.979-10.979s4.916-10.979 10.979-10.979c6.064 0 10.979 4.916 10.979 10.979v.004c-.002 6.061-4.915 10.973-10.975 10.975z"/>
      </svg>
    </button>
    <div class="accessibility-widget-panel">
      <div class="accessibility-widget-header">
        <h3>Accessibility Settings</h3>
      </div>
      <div class="accessibility-widget-content">
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
      <div class="accessibility-widget-footer">
        ${settings.poweredByText}
      </div>
    </div>
  `;

  // Add styles
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
      height: 600px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: none;
      overflow-y: auto;
    }

    .accessibility-widget-panel.open {
      display: block;
    }

    .accessibility-widget-header {
      padding: 16px;
      background: ${settings.headerColor};
      border-radius: 8px 8px 0 0;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .accessibility-widget-header h3 {
      margin: 0;
      color: ${settings.headerTextColor};
      font-size: 18px;
    }

    .accessibility-widget-content {
      padding: 16px;
    }

    .widget-section {
      margin-bottom: 24px;
    }

    .widget-section h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
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
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 80px;
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
      margin-bottom: 4px;
    }

    .feature-text {
      font-size: 12px;
      text-align: center;
      color: #1e293b;
    }

    .accessibility-widget-footer {
      padding: 16px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      color: ${settings.poweredByColor};
      font-size: 14px;
      position: sticky;
      bottom: 0;
      background: white;
      z-index: 1;
    }
  `;
  document.head.appendChild(styles);

  // Basic functionality
  const button = container.querySelector('.accessibility-widget-button');
  const panel = container.querySelector('.accessibility-widget-panel');
  const featureButtons = container.querySelectorAll('.feature-button');

  button.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Handle feature buttons
  featureButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const feature = button.dataset.feature;
      applyFeature(feature, button.classList.contains('active'));
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
})();
