// Update the features HTML section in the widget code
const featuresHtml = `
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
`;

// Add these new feature implementations to the features object
const features = {
  // ... existing features ...
  readAllText: {
    apply: (active) => {
      if (active) {
        const utterance = new SpeechSynthesisUtterance(document.body.innerText);
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  },
  clickToSpeech: {
    apply: (active) => {
      if (active) {
        document.body.addEventListener('click', speakText);
      } else {
        document.body.removeEventListener('click', speakText);
      }
    }
  },
  highSaturation: {
    apply: (active) => {
      document.body.style.filter = active ? 'saturate(150%)' : '';
    }
  },
  lowSaturation: {
    apply: (active) => {
      document.body.style.filter = active ? 'saturate(50%)' : '';
    }
  },
  muteSounds: {
    apply: (active) => {
      document.querySelectorAll('audio, video').forEach(element => {
        element.muted = active;
      });
    }
  },
  highlightHover: {
    apply: (active) => {
      if (active) {
        const style = document.createElement('style');
        style.id = 'highlight-hover';
        style.textContent = '*:hover { outline: 2px solid #2563eb !important; }';
        document.head.appendChild(style);
      } else {
        document.getElementById('highlight-hover')?.remove();
      }
    }
  },
  bigCursor: {
    apply: (active) => {
      if (active) {
        const style = document.createElement('style');
        style.id = 'big-cursor';
        style.textContent = '* { cursor: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2\'/%3E%3C/svg%3E") 4 4, auto !important; }';
        document.head.appendChild(style);
      } else {
        document.getElementById('big-cursor')?.remove();
      }
    }
  }
};

// Helper function for click-to-speech
function speakText(event) {
  const text = event.target.textContent;
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}
