(function() {
  let globalSettings = null;

  function createWidgetHTML(settings) {
    // Existing widget HTML creation code remains the same
    return `
      <div class="widget-toggle">
        <button aria-label="Accessibility Options">
          <svg viewBox="0 0 122.88 122.88" class="widget-icon">
            <path fill="currentColor" d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"/>
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
          ${settings.powered_by_text || 'Powered by Accessibility Widget'}
        </div>
      </div>
    `;
  }

  // Rest of the widget functionality remains the same
  function handleFeatureToggle(feature, isActive) {
    // Existing feature toggle code remains the same
  }

  function handleTextToSpeech(e) {
    // Existing text-to-speech code remains the same
  }

  function moveReadingGuide(e) {
    // Existing reading guide code remains the same
  }

  function addStyles(settings) {
    // Existing styles code remains the same
  }

  function addEventListeners(container) {
    // Existing event listeners code remains the same
  }

  async function initWidget() {
    try {
      const scripts = document.getElementsByTagName('script');
      let currentScript;
      for (let script of scripts) {
        if (script.src.includes('accessibility-widget.js')) {
          currentScript = script;
          break;
        }
      }

      const clientKey = currentScript?.getAttribute('data-client-key');

      if (!clientKey) {
        console.error('Missing client key for accessibility widget');
        return;
      }

      // Get the base URL from the script src
      const scriptUrl = new URL(currentScript.src);
      const baseUrl = `${scriptUrl.protocol}//${scriptUrl.host}`;

      // Fetch settings from our proxy endpoint
      const response = await fetch(`${baseUrl}/api/widget-settings/${clientKey}`);

      if (!response.ok) {
        throw new Error('Failed to load widget settings');
      }

      const settings = await response.json();
      if (settings) {
        globalSettings = settings;
        const container = document.createElement('div');
        container.id = 'accessibility-widget-container';
        container.innerHTML = createWidgetHTML(globalSettings);
        addStyles(globalSettings);
        document.body.appendChild(container);
        addEventListeners(container);
      }
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
