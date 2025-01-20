(function() {
  // Get settings from script data attributes
  const script = document.currentScript;
  const settings = {
    headerColor: script.getAttribute('data-header-color') || '#60a5fa',
    headerTextColor: script.getAttribute('data-header-text-color') || '#1e293b',
    buttonColor: script.getAttribute('data-button-color') || '#2563eb',
    poweredByText: script.getAttribute('data-powered-by-text') || 'Powered by Accessibility Widget',
    poweredByColor: script.getAttribute('data-powered-by-color') || '#64748b'
  };

  // Rest of the widget code remains exactly the same, but using 'settings' instead of 'widgetSettings'
  ...
})();
