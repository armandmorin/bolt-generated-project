(function() {
  // Create widget immediately without waiting for settings
  const createWidget = () => {
    const container = document.createElement('div');
    container.className = 'accessibility-widget-container';
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.bottom = '20px';
    container.style.zIndex = '99999';

    container.innerHTML = `
      <button class="accessibility-widget-button" aria-label="Accessibility Options">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
        </svg>
      </button>
      <div class="accessibility-widget-panel">
        <div class="accessibility-widget-header">
          <h3>Accessibility Settings</h3>
        </div>
        <div class="accessibility-widget-content">
          <!-- Content Adjustments -->
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

          <!-- Color Adjustments -->
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

          <!-- Orientation Adjustments -->
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
              <button class="feature-button" data-feature="stopAnimations">
                <span class="feature-icon">⛔</span>
                <span class="feature-text">Stop Animations</span>
              </button>
              <button class="feature-button" data-feature="highlightHover">
                <span class="feature-icon">🖱</span>
                <span class="feature-text">Highlight Hover</span>
              </button>
              <button class="feature-button" data-feature="bigCursor">
                <span class="feature-icon">➜</span>
                <span class="feature-text">Big Cursor</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accessibility-widget-footer">
          Powered by Accessibility Widget
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .accessibility-widget-button {
        width: 64px;
        height: 64px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .accessibility-widget-button:hover {
        transform: scale(1.1);
      }

      .accessibility-widget-panel {
        position: absolute;
        bottom: calc(100% + 16px);
        right: 0;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        overflow: hidden;
        max-height: 80vh;
        overflow-y: auto;
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      .accessibility-widget-header {
        padding: 16px;
        background: #60a5fa;
        color: #1e293b;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .accessibility-widget-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .accessibility-widget-content {
        padding: 16px;
      }

      .widget-section {
        margin-bottom: 24px;
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
      }

      .feature-icon {
        font-size: 24px;
        line-height: 1;
      }

      .feature-text {
        font-size: 12px;
        text-align: center;
        line-height: 1.2;
      }

      .accessibility-widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
        position: sticky;
        bottom: 0;
        background: white;
      }
    `;
    document.head.appendChild(styles);

    // Add event listeners
    const button = container.querySelector('.accessibility-widget-button');
    const panel = container.querySelector('.accessibility-widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    button.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    featureButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const feature = btn.getAttribute('data-feature');
        handleFeature(feature, btn.classList.contains('active'));
      });
    });

    return container;
  };

  const handleFeature = (feature, isActive) => {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = isActive ? 'Arial, sans-serif' : '';
        break;
      case 'readAllText':
        if (isActive) {
          const text = document.body.textContent;
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        } else {
          window.speechSynthesis.cancel();
        }
        break;
      case 'clickToSpeech':
        if (isActive) {
          document.body.addEventListener('click', handleClickToSpeech);
        } else {
          document.body.removeEventListener('click', handleClickToSpeech);
        }
        break;
      case 'fontScaling':
        document.body.style.fontSize = isActive ? '120%' : '';
        break;
      case 'highlightLinks':
        const links = document.querySelectorAll('a');
        links.forEach(link => {
          link.style.backgroundColor = isActive ? '#ffeb3b' : '';
          link.style.color = isActive ? '#000' : '';
        });
        break;
      case 'highlightTitles':
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          heading.style.backgroundColor = isActive ? '#e3f2fd' : '';
        });
        break;
      case 'highContrast':
        document.body.style.filter = isActive ? 'contrast(150%)' : '';
        break;
      case 'lightContrast':
        if (isActive) {
          document.body.style.backgroundColor = '#ffffff';
          document.body.style.color = '#000000';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        }
        break;
      case 'darkContrast':
        if (isActive) {
          document.body.style.backgroundColor = '#000000';
          document.body.style.color = '#ffffff';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        }
        break;
      case 'monochrome':
        document.body.style.filter = isActive ? 'grayscale(100%)' : '';
        break;
      case 'highSaturation':
        document.body.style.filter = isActive ? 'saturate(200%)' : '';
        break;
      case 'lowSaturation':
        document.body.style.filter = isActive ? 'saturate(50%)' : '';
        break;
      case 'muteSounds':
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach(element => {
          element.muted = isActive;
        });
        break;
      case 'hideImages':
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          img.style.display = isActive ? 'none' : '';
        });
        break;
      case 'stopAnimations':
        const style = document.createElement('style');
        style.id = 'stop-animations';
        style.textContent = '* { animation: none !important; transition: none !important; }';
        if (isActive) {
          document.head.appendChild(style);
        } else {
          document.getElementById('stop-animations')?.remove();
        }
        break;
      case 'highlightHover':
        if (isActive) {
          const style = document.createElement('style');
          style.id = 'highlight-hover';
          style.textContent = '*:hover { outline: 2px solid #2563eb !important; }';
          document.head.appendChild(style);
        } else {
          document.getElementById('highlight-hover')?.remove();
        }
        break;
      case 'bigCursor':
        document.body.style.cursor = isActive ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2\'/%3E%3C/svg%3E") 4 4, auto' : '';
        break;
    }
  };

  const handleClickToSpeech = (e) => {
    if (e.target.textContent) {
      const utterance = new SpeechSynthesisUtterance(e.target.textContent);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initialize widget
  const widget = createWidget();
  document.body.appendChild(widget);
})();
