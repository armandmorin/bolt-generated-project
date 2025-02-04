(function() {
  function createWidgetHTML(settings) {
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
          ${settings.powered_by_text || 'Powered by Accessibility Widget'}
        </div>
      </div>
    `;
  }

  function addStyles(settings) {
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
        width: ${settings.button_size || '64px'};
        height: ${settings.button_size || '64px'};
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background-color: ${settings.button_color || '#2563eb'};
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s ease;
        padding: 0;
        font-size: 24px;
      }

      .widget-toggle button:hover {
        transform: scale(1.1);
      }

      /* Rest of your existing styles... */
    `;
    document.head.appendChild(styles);
  }

  async function initWidget() {
    const currentScript = document.currentScript;
    const supabaseUrl = currentScript?.getAttribute('data-supabase-url');
    const supabaseKey = currentScript?.getAttribute('data-supabase-key');
    const clientKey = currentScript?.getAttribute('data-client-key');

    if (!supabaseUrl || !supabaseKey || !clientKey) {
      console.error('Missing required configuration for accessibility widget');
      return;
    }

    try {
      // Fetch global settings
      const globalSettingsResponse = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!globalSettingsResponse.ok) {
        throw new Error('Failed to load global widget settings');
      }

      const globalSettings = await globalSettingsResponse.json();
      
      // Verify client
      const clientResponse = await fetch(`${supabaseUrl}/rest/v1/clients?client_key=eq.${clientKey}&select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!clientResponse.ok) {
        throw new Error('Failed to verify client');
      }

      const clientData = await clientResponse.json();
      
      if (!clientData || !clientData.length) {
        throw new Error('Invalid client key');
      }

      // Create widget with settings
      createWidget(globalSettings[0]);
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  function createWidget(settings) {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    container.innerHTML = createWidgetHTML(settings);
    addStyles(settings);
    document.body.appendChild(container);
    setupEventListeners(container);
  }

  function setupEventListeners(container) {
    const toggle = container.querySelector('.widget-toggle button');
    const panel = container.querySelector('.widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      panel.classList.toggle('open');
    });

    featureButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('active');
        const feature = button.dataset.feature;
        // Feature toggle logic here
      });
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
