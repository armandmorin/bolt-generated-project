(function() {
  // ... (keep existing configuration code)

  // Create and inject styles
  const createStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .accessibility-widget-container {
        position: fixed;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .accessibility-widget-button {
        width: ${widgetSettings.buttonSize};
        height: ${widgetSettings.buttonSize};
        padding: 0;
        border: none;
        border-radius: 50%;
        background-color: ${widgetSettings.buttonColor};
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
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        overflow: hidden;
        /* Position the panel above the button */
        bottom: calc(100% + 16px);
        right: 0;
      }

      /* Adjust panel position when button is on the left */
      .accessibility-widget-container[data-position*="left"] .accessibility-widget-panel {
        right: auto;
        left: 0;
      }

      /* Adjust panel position when button is on the top */
      .accessibility-widget-container[data-position*="top"] .accessibility-widget-panel {
        bottom: auto;
        top: calc(100% + 16px);
      }

      .accessibility-widget-panel.open {
        display: block;
      }

      /* Rest of your styles... */
    `;
    document.head.appendChild(styleSheet);
  };

  // Create widget HTML
  const createWidget = () => {
    const container = document.createElement('div');
    container.className = 'accessibility-widget-container';
    container.setAttribute('data-position', widgetSettings.buttonPosition);
    
    // Set position based on settings
    if (widgetSettings.buttonPosition.includes('right')) {
      container.style.right = '20px';
    } else {
      container.style.left = '20px';
    }
    if (widgetSettings.buttonPosition.includes('bottom')) {
      container.style.bottom = '20px';
    } else {
      container.style.top = '20px';
    }

    // Rest of your widget HTML...
    
    return container;
  };

  // ... (keep rest of the code)
})();
