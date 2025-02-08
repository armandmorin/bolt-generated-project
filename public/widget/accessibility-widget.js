(function() {
  // Internal Supabase configuration
  const SUPABASE_URL = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

  let globalSettings = null;

  function getDefaultSettings() {
    return {
      header_color: '#60a5fa',
      header_text_color: '#ffffff',
      button_color: '#2563eb',
      powered_by_text: 'Powered by Accessibility Widget',
      powered_by_color: '#64748b',
      button_size: '64px',
      button_position: 'bottom-right'
    };
  }

  async function getGlobalSettings() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/global_widget_settings?select=*&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch global settings');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        console.log('Using global settings');
        return data[0];
      }

      console.log('No global settings found, using defaults');
      return getDefaultSettings();
    } catch (error) {
      console.error('Error fetching global settings:', error);
      return getDefaultSettings();
    }
  }

  async function getClientSettings(clientKey) {
    try {
      // First, get the client data
      const clientResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/clients?select=id&client_key=eq.${encodeURIComponent(clientKey)}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!clientResponse.ok) {
        throw new Error('Failed to fetch client');
      }

      const clientData = await clientResponse.json();
      if (!clientData || clientData.length === 0) {
        console.log('Client not found, using global settings');
        return getGlobalSettings();
      }

      const clientId = clientData[0].id;

      // Then get client-specific settings
      const settingsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/widget_settings?select=*&client_id=eq.${encodeURIComponent(clientId)}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!settingsResponse.ok) {
        throw new Error('Failed to fetch client settings');
      }

      const settingsData = await settingsResponse.json();
      
      if (settingsData && settingsData.length > 0) {
        console.log('Using client-specific settings');
        return settingsData[0];
      }

      console.log('No client settings found, using global settings');
      return getGlobalSettings();
    } catch (error) {
      console.error('Error in getClientSettings:', error);
      return getGlobalSettings();
    }
  }

  function createWidgetHTML(settings) {
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

      .widget-toggle .widget-icon {
        width: 32px;
        height: 32px;
        color: white;
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
      }

      .widget-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: ${settings.header_text_color || '#ffffff'} !important;
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

  function handleFeatureToggle(feature, isActive) {
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
        document.body.style.cursor = isActive ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%23ffeb3b\' opacity=\'0.5\'/%3E%3C/svg%3E") 16 16, auto' : '';
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

  function addEventListeners(container) {
    const toggle = container.querySelector('.widget-toggle button');
    const panel = container.querySelector('.widget-panel');
    const featureButtons = container.querySelectorAll('.feature-button');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    featureButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('active');
        const feature = button.dataset.feature;
        handleFeatureToggle(feature, button.classList.contains('active'));
      });
    });
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
        console.error('Missing required client key for accessibility widget');
        return;
      }

      console.log('Initializing widget for client key:', clientKey);
      
      // Get client-specific or global settings
      const settings = await getClientSettings(clientKey);
      
      if (settings) {
        globalSettings = settings;
        console.log('Applied settings:', globalSettings);
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
