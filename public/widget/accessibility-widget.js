(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const clientKey = currentScript?.getAttribute('data-client-key');
  const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
  const supabaseKey = currentScript?.getAttribute('data-supabase-key');

  // Validate required parameters
  if (!clientKey || !supabaseUrl || !supabaseKey) {
    console.error('Accessibility Widget: Missing required configuration');
    return;
  }

  // Function to fetch settings from Supabase
  async function fetchSettings() {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/widget_settings?client_key=eq.${clientKey}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const settings = await response.json();

      if (!settings || settings.length === 0) {
        throw new Error('No settings found for this client key');
      }

      return settings[0];
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      // Return default settings if there's an error
      return {
        header_color: '#60a5fa',
        header_text_color: '#1e293b',
        button_color: '#2563eb',
        powered_by_text: 'Powered by Accessibility Widget',
        powered_by_color: '#64748b'
      };
    }
  }

  // Initialize widget with settings
  async function initWidget() {
    const settings = await fetchSettings();

    // Create and append widget container
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    document.body.appendChild(container);

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
        background: ${settings.button_color};
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

      .accessibility-widget-button:hover {
        transform: scale(1.1);
      }

      .accessibility-widget-panel {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 320px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        overflow-y: auto;
        max-height: 80vh;
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      .accessibility-widget-header {
        padding: 16px;
        background: ${settings.header_color};
        border-radius: 8px 8px 0 0;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .accessibility-widget-header h3 {
        margin: 0;
        color: ${settings.header_text_color};
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
        color: ${settings.powered_by_color};
        font-size: 14px;
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 1;
      }
    `;
    document.head.appendChild(styles);

    // Add widget HTML
    container.innerHTML = `
      <button class="accessibility-widget-button" aria-label="Accessibility Options">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="m11.997 1.771h-.001c-5.647 0-10.226 4.578-10.226 10.226s4.578 10.226 10.226 10.226c5.647 0 10.226-4.578 10.226-10.226 0-5.647-4.578-10.225-10.225-10.226zm.198 2.252c.801 0 1.45.649 1.45 1.45s-.649 1.45-1.45 1.45-1.45-.649-1.45-1.45c0-.801.649-1.45 1.45-1.45zm5.307 3.668c-.087.117-.216.199-.364.223h-.003l-3.445.53c-.03.002-.056.017-.074.038-.018.022.343 4.274.343 4.274l1.958 5.337c.055.104.087.226.087.357 0 .295-.165.551-.407.681l-.004.002c-.074.033-.161.053-.253.053-.001 0-.001 0-.002 0-.33-.016-.608-.224-.728-.513l-.002-.006s-2.508-5.691-2.522-5.734c-.016-.047-.06-.081-.112-.081-.048 0-.088.031-.103.074v.001c-.014.041-2.522 5.734-2.522 5.734-.121.294-.399.501-.727.518h-.002c-.001 0-.001 0-.002 0-.091 0-.178-.019-.256-.054l.004.002c-.176-.08-.308-.229-.364-.411l-.001-.005c-.025-.078-.04-.168-.04-.261 0-.133.029-.258.082-.371l-.002.005s1.91-5.165 1.911-5.174l.355-4.363c0-.003 0-.006 0-.01 0-.054-.04-.099-.092-.107h-.001l-3.36-.52c-.271-.043-.475-.275-.475-.554 0-.31.251-.561.561-.561.03 0 .06.002.089.007h-.003l3.223.498h3.421c.007.002.015.003.024.003s.016-.001.024-.003h-.001l3.244-.497c.024-.004.052-.006.08-.006.28 0 .513.203.56.47v.003c.004.026.007.057.007.088 0 .124-.04.238-.109.33l.001-.002z"/>
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
            </div>
          </div>

          <div class="widget-section">
            <h4>Orientation Adjustments</h4>
            <div class="feature-grid">
              <button class="feature-button" data-feature="hideImages">
                <span class="feature-icon">🖼</span>
                <span class="feature-text">Hide Images</span>
              </button>
              <button class="feature-button" data-feature="stopAnimations">
                <span class="feature-icon">⛔</span>
                <span class="feature-text">Stop Animations</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accessibility-widget-footer">
          ${settings.powered_by_text}
        </div>
      </div>
    `;

    // Get DOM elements
    const button = container.querySelector('.accessibility-widget-button');
    const panel = container.querySelector('.accessibility-widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    // Toggle panel
    button.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    // Feature functionality
    const features = {
      readableFont: {
        apply: (active) => {
          document.body.style.fontFamily = active ? 'Arial, sans-serif' : '';
          document.body.style.lineHeight = active ? '1.6' : '';
        }
      },
      fontScaling: {
        apply: (active) => {
          document.body.style.fontSize = active ? '120%' : '';
        }
      },
      highlightLinks: {
        apply: (active) => {
          document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = active ? '#ffff00' : '';
            link.style.color = active ? '#000000' : '';
          });
        }
      },
      highlightTitles: {
        apply: (active) => {
          document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(title => {
            title.style.backgroundColor = active ? '#e0e7ff' : '';
          });
        }
      },
      highContrast: {
        apply: (active) => {
          document.body.style.filter = active ? 'contrast(150%)' : '';
        }
      },
      lightContrast: {
        apply: (active) => {
          document.body.style.filter = active ? 'brightness(120%)' : '';
        }
      },
      darkContrast: {
        apply: (active) => {
          document.body.style.filter = active ? 'brightness(80%)' : '';
        }
      },
      monochrome: {
        apply: (active) => {
          document.body.style.filter = active ? 'grayscale(100%)' : '';
        }
      },
      hideImages: {
        apply: (active) => {
          document.querySelectorAll('img').forEach(img => {
            img.style.display = active ? 'none' : '';
          });
        }
      },
      stopAnimations: {
        apply: (active) => {
          const style = document.createElement('style');
          style.id = 'stop-animations';
          style.textContent = '* { animation: none !important; transition: none !important; }';
          if (active) {
            document.head.appendChild(style);
          } else {
            document.getElementById('stop-animations')?.remove();
          }
        }
      }
    };

    // Handle feature buttons
    featureButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const feature = button.dataset.feature;
        const isActive = button.classList.toggle('active');
        
        // Reset other features in the same category if needed
        if (feature.includes('Contrast')) {
          featureButtons.forEach(btn => {
            if (btn !== button && btn.dataset.feature.includes('Contrast')) {
              btn.classList.remove('active');
              features[btn.dataset.feature].apply(false);
            }
          });
        }

        // Apply feature
        if (features[feature]) {
          features[feature].apply(isActive);
        }
      });
    });
  }

  // Initialize the widget
  initWidget();
})();
