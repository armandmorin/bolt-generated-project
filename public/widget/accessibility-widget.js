// Update only the styles section in the existing file
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
    background-color: #4169E1;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease;
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
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: none;
  }

  .widget-panel.open {
    display: block;
  }

  .widget-header {
    padding: 12px 16px;
    background: #4CAF50;
    color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
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
    grid-template-columns: repeat(1, 1fr);
    gap: 8px;
  }

  .feature-button {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
    font-size: 14px;
  }

  .feature-button:hover {
    background: #e8e8e8;
  }

  .feature-button.active {
    background: #4CAF50;
    color: white;
    border-color: #45a049;
  }

  .feature-icon {
    margin-right: 8px;
    font-size: 16px;
    min-width: 24px;
    text-align: center;
  }

  .feature-text {
    flex: 1;
  }

  .widget-footer {
    padding: 12px;
    text-align: center;
    font-size: 12px;
    color: #666;
    border-top: 1px solid #eee;
  }

  #reading-guide {
    position: fixed;
    height: 40px;
    width: 100%;
    background-color: rgba(255, 255, 0, 0.2);
    pointer-events: none;
    z-index: 9999;
    transition: top 0.1s ease;
  }
`;
