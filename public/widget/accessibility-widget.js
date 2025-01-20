// Update only the relevant parts of the widget.js file:

  // Update the toggle button HTML:
  const toggleHtml = `
    <button class="widget-toggle" aria-label="Accessibility Options">
      <svg class="widget-toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM12 9c-2.73 0-5.22 1-7.16 2.66l1.45 1.45C7.77 11.87 9.83 11 12 11c2.17 0 4.23.87 5.71 2.11l1.45-1.45C17.22 10 14.73 9 12 9zm0 4c-1.64 0-3.15.57-4.36 1.51l1.45 1.45c.79-.48 1.73-.76 2.91-.76 1.18 0 2.12.28 2.91.76l1.45-1.45C15.15 13.57 13.64 13 12 13zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
      </svg>
    </button>
  `;

  // Update the header styles:
  const styles = document.createElement('style');
  styles.textContent = `
    /* ... other styles ... */

    .widget-header h3 {
      margin: 0;
      font-size: 18px; /* Smaller font size */
      font-weight: 600;
      color: ${widgetSettings.headerTextColor || '#1e293b'}; /* Use header text color from settings */
    }

    /* ... other styles ... */
  `;

  // Update the footer:
  const footerHtml = `
    <div class="widget-footer" style="color: ${widgetSettings.poweredByColor}">
      ${widgetSettings.poweredByText || 'Powered by Accessibility Widget'}
    </div>
  `;
