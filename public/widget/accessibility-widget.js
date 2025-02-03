(function() {
  function createWidgetHTML() {
    return `
      <div class="widget-toggle">
        <button aria-label="Accessibility Options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
          </svg>
        </button>
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
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        max-height: 80vh;
        overflow-y: auto;
      }

      .widget-panel.open {
        display: block;
      }

      .widget-header {
        padding: 16px;
        background: ${settings.header_color || '#60a5fa'};
        color: ${settings.header_text_color || '#ffffff'};
        position: sticky;
        top: 0;
        z-index: 1;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
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
        width: 100%;
        min-height: 80px;
      }

      .feature-button:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
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

      .feature-text {
        font-size: 12px;
        text-align: center;
        line-height: 1.2;
        color: #475569;
        margin: 0;
        padding: 0;
      }

      .widget-footer {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        color: ${settings.powered_by_color || '#64748b'};
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 1;
      }
    `;
    document.head.appendChild(styles);
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
      const response = await fetch(`${supabaseUrl}/rest/v1/clients?client_key=eq.${clientKey}&select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load widget settings');
      }

      const settings = await response.json();
      if (!settings || !settings.length) {
        throw new Error('No settings found for this client');
      }

      createWidget(settings[0]);
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  function createWidget(settings) {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    container.innerHTML = createWidgetHTML();
    addStyles(settings);
    document.body.appendChild(container);
    setupEventListeners(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
