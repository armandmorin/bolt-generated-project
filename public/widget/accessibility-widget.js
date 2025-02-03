// Update only the styles section in the file
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
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: #2563eb;
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
    background: #60a5fa;
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
    color: #1e293b;
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
    color: #64748b;
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 1;
  }

  /* Scrollbar Styling */
  .widget-panel::-webkit-scrollbar {
    width: 6px;
  }

  .widget-panel::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  .widget-panel::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .widget-panel::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .widget-panel,
    .widget-footer {
      background: #1e293b;
    }

    .widget-header {
      background: #3b82f6;
      color: white;
    }

    .feature-button {
      background: #0f172a;
      border-color: #334155;
      color: #e2e8f0;
    }

    .feature-button:hover {
      background: #1e293b;
      border-color: #475569;
    }

    .feature-button.active {
      background: #312e81;
      border-color: #4f46e5;
      color: white;
    }

    .feature-text {
      color: #94a3b8;
    }

    .widget-footer {
      border-top-color: #334155;
      color: #94a3b8;
    }
  }
`;
