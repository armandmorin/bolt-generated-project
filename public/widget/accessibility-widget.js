(function() {
  let widgetSettings = {
    features: {
      readableFont: false,
      highContrast: false,
      largeText: false,
      highlightLinks: false,
      textToSpeech: false,
      dyslexiaFont: false,
      cursorHighlight: false,
      invertColors: false,
      reducedMotion: false,
      focusMode: false,
      readingGuide: false,
      monochrome: false
    }
  };

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
            ${createFeatureButtons()}
          </div>
        </div>
        <div class="widget-footer">
          Powered by Accessibility Widget
        </div>
      </div>
    `;
  }

  function createFeatureButtons() {
    const features = {
      readableFont: { icon: 'Aa', label: 'Readable Font' },
      highContrast: { icon: '◐', label: 'High Contrast' },
      largeText: { icon: 'A+', label: 'Large Text' },
      highlightLinks: { icon: '🔗', label: 'Highlight Links' },
      textToSpeech: { icon: '🔊', label: 'Text to Speech' },
      dyslexiaFont: { icon: 'Dx', label: 'Dyslexia Font' },
      cursorHighlight: { icon: '👆', label: 'Cursor Highlight' },
      invertColors: { icon: '🔄', label: 'Invert Colors' },
      reducedMotion: { icon: '⚡', label: 'Reduced Motion' },
      focusMode: { icon: '👀', label: 'Focus Mode' },
      readingGuide: { icon: '📏', label: 'Reading Guide' },
      monochrome: { icon: '⚫', label: 'Monochrome' }
    };

    return Object.entries(features)
      .map(([key, { icon, label }]) => `
        <button class="feature-button" data-feature="${key}">
          <span class="feature-icon">${icon}</span>
          <span class="feature-text">${label}</span>
        </button>
      `)
      .join('');
  }

  function applyFeature(feature, isActive) {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = isActive ? 'Arial, sans-serif' : '';
        break;
      case 'highContrast':
        document.body.style.filter = isActive ? 'contrast(150%)' : '';
        break;
      case 'largeText':
        document.body.style.fontSize = isActive ? '120%' : '';
        break;
      case 'highlightLinks':
        document.querySelectorAll('a').forEach(link => {
          link.style.backgroundColor = isActive ? '#ffeb3b' : '';
          link.style.color = isActive ? '#000000' : '';
        });
        break;
      case 'textToSpeech':
        if (isActive) {
          document.addEventListener('click', handleTextToSpeech);
        } else {
          document.removeEventListener('click', handleTextToSpeech);
          window.speechSynthesis?.cancel();
        }
        break;
      case 'dyslexiaFont':
        document.body.style.fontFamily = isActive ? 'OpenDyslexic, Arial, sans-serif' : '';
        break;
      case 'cursorHighlight':
        document.body.style.cursor = isActive ? 
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%23ffeb3b\' opacity=\'0.5\'/%3E%3C/svg%3E") 16 16, auto' : '';
        break;
      case 'invertColors':
        document.body.style.filter = isActive ? 'invert(100%)' : '';
        break;
      case 'reducedMotion':
        document.body.style.setProperty('--reduced-motion', isActive ? 'reduce' : 'no-preference');
        break;
      case 'focusMode':
        if (isActive) {
          document.body.style.maxWidth = '800px';
          document.body.style.margin = '0 auto';
          document.body.style.padding = '20px';
          document.body.style.backgroundColor = '#f8f9fa';
        } else {
          document.body.style.maxWidth = '';
          document.body.style.margin = '';
          document.body.style.padding = '';
          document.body.style.backgroundColor = '';
        }
        break;
      case 'readingGuide':
        if (isActive) {
          const guide = document.createElement('div');
          guide.id = 'reading-guide';
          guide.style.position = 'fixed';
          guide.style.height = '40px';
          guide.style.width = '100%';
          guide.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
          guide.style.pointerEvents = 'none';
          guide.style.zIndex = '9999';
          document.body.appendChild(guide);
          document.addEventListener('mousemove', moveReadingGuide);
        } else {
          document.getElementById('reading-guide')?.remove();
          document.removeEventListener('mousemove', moveReadingGuide);
        }
        break;
      case 'monochrome':
        document.body.style.filter = isActive ? 'grayscale(100%)' : '';
        break;
    }
  }

  function handleTextToSpeech(e) {
    if (e.target.textContent && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(e.target.textContent);
      window.speechSynthesis.speak(utterance);
    }
  }

  function moveReadingGuide(e) {
    const guide = document.getElementById('reading-guide');
    if (guide) {
      guide.style.top = `${e.clientY - 20}px`;
    }
  }

  async function loadSettings() {
    const script = document.currentScript;
    const supabaseUrl = script?.getAttribute('data-supabase-url');
    const supabaseKey = script?.getAttribute('data-supabase-key');

    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/global_widget_settings?select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.[0]) {
            widgetSettings = {
              ...widgetSettings,
              ...data[0]
            };
            updateWidgetStyles();
          }
        }
      } catch (error) {
        console.warn('Error loading widget settings:', error);
      }
    }
  }

  function updateWidgetStyles() {
    const container = document.getElementById('accessibility-widget-container');
    if (!container) return;

    const toggle = container.querySelector('.widget-toggle button');
    const header = container.querySelector('.widget-header');
    const footer = container.querySelector('.widget-footer');

    if (toggle) {
      toggle.style.backgroundColor = widgetSettings.button_color || '#2563eb';
      toggle.style.width = widgetSettings.button_size || '64px';
      toggle.style.height = widgetSettings.button_size || '64px';
    }

    if (header) {
      header.style.backgroundColor = widgetSettings.header_color || '#60a5fa';
      header.style.color = widgetSettings.header_text_color || '#ffffff';
    }

    if (footer) {
      footer.style.color = widgetSettings.powered_by_color || '#64748b';
      footer.textContent = widgetSettings.powered_by_text || 'Powered by Accessibility Widget';
    }
  }

  function initWidget() {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    container.innerHTML = createWidgetHTML();
    document.body.appendChild(container);

    const toggle = container.querySelector('.widget-toggle button');
    const panel = container.querySelector('.widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    featureButtons.forEach(button => {
      button.addEventListener('click', () => {
        const feature = button.dataset.feature;
        button.classList.toggle('active');
        widgetSettings.features[feature] = !widgetSettings.features[feature];
        applyFeature(feature, widgetSettings.features[feature]);
      });
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    loadSettings();
  }

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `/* Add your CSS styles here */`; // Add your CSS from widget.module.css
  document.head.appendChild(styles);

  // Initialize widget
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
