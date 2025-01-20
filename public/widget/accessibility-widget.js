// Update only the relevant CSS styles in the styles.textContent string:

    .widget-panel {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 320px;
      height: 600px; /* Fixed height */
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: none;
    }

    .widget-header {
      padding: 20px;
      background-color: #60a5fa;
      color: #1e293b;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .widget-body {
      padding: 24px;
      height: calc(600px - 57px - 49px); /* Subtract header and footer heights */
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }

    /* Custom scrollbar styles for webkit browsers */
    .widget-body::-webkit-scrollbar {
      width: 8px;
    }

    .widget-body::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .widget-body::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }

    .widget-footer {
      padding: 16px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      position: sticky;
      bottom: 0;
      background: white;
      z-index: 1;
    }
