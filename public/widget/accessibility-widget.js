(function() {
  // Create widget container
  function createWidgetContainer() {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    return container;
  }

  // Create widget HTML
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

  // Add styles (keep your existing styles here)
  const styles = document.createElement('style');
  styles.textContent = `
    /* Your existing styles here */
  `;

  // Initialize widget
  function initWidget() {
    // Add styles first
    document.head.appendChild(styles);

    // Create and add widget container
    const container = createWidgetContainer();
    container.innerHTML = createWidgetHTML();
    document.body.appendChild(container);

    // Add event listeners
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

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  // Load widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
