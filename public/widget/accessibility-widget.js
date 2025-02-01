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
          <div class="widget-section">
            <h4>Content Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="readableFont">
                <span class="feature-icon">Aa</span>
                <span class="feature-text">Readable Font</span>
              </button>
              <button class="feature-button" data-feature="highContrast">
                <span class="feature-icon">◐</span>
                <span class="feature-text">High Contrast</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accessibility-widget-footer">
          Powered by Accessibility Widget
        </div>
      </div>
    `;

    // Add basic styles
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
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      .accessibility-widget-header {
        padding: 16px;
        background: #60a5fa;
        color: #1e293b;
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
        margin-bottom: 16px;
      }

      .widget-section h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
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
      }

      .feature-button.active {
        background: #e0e7ff;
        border-color: #818cf8;
      }

      .accessibility-widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
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
        document.body.style.fontFamily = isActive ? 
          'Arial, sans-serif' : '';
        break;
      case 'highContrast':
        if (isActive) {
          document.body.style.backgroundColor = '#000';
          document.body.style.color = '#fff';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        }
        break;
    }
  };

  // Initialize widget
  const widget = createWidget();
  document.body.appendChild(widget);
})();
