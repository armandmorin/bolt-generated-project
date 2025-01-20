// Immediately executing function to avoid global scope pollution
(function() {
  // Create and append widget container immediately
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  document.body.appendChild(container);

  // Basic accessibility widget HTML
  container.innerHTML = `
    <button class="accessibility-widget-button" aria-label="Accessibility Options">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM12 9c-2.73 0-5.22 1-7.16 2.66l1.45 1.45C7.77 11.87 9.83 11 12 11c2.17 0 4.23.87 5.71 2.11l1.45-1.45C17.22 10 14.73 9 12 9zm0 4c-1.64 0-3.15.57-4.36 1.51l1.45 1.45c.79-.48 1.73-.76 2.91-.76 1.18 0 2.12.28 2.91.76l1.45-1.45C15.15 13.57 13.64 13 12 13zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
      </svg>
    </button>
    <div class="accessibility-widget-panel">
      <div class="accessibility-widget-header">
        <h3>Accessibility Settings</h3>
      </div>
      <div class="accessibility-widget-content">
        <!-- Widget content here -->
      </div>
    </div>
  `;

  // Add basic styles immediately
  const styles = document.createElement('style');
  styles.textContent = `
    #accessibility-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
    }

    .accessibility-widget-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: transform 0.3s ease;
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
    }

    .accessibility-widget-panel.open {
      display: block;
    }

    .accessibility-widget-header {
      padding: 16px;
      background: #60a5fa;
      border-radius: 8px 8px 0 0;
    }

    .accessibility-widget-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 18px;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .accessibility-widget-content {
      padding: 16px;
    }
  `;
  document.head.appendChild(styles);

  // Basic functionality
  const button = container.querySelector('.accessibility-widget-button');
  const panel = container.querySelector('.accessibility-widget-panel');

  button.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
})();
