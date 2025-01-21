// In-memory storage for widget settings (in a real app, this would be a database)
let widgetSettings = new Map();

export const getWidgetSettings = (clientKey) => {
  // Get settings from localStorage
  const settings = JSON.parse(localStorage.getItem('widgetSettings') || '{}');
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');
  
  // Verify client exists and is active
  const client = clients.find(c => c.scriptKey === clientKey);
  if (!client || client.status !== 'active') {
    throw new Error('Invalid or inactive client key');
  }

  return {
    headerColor: settings.headerColor || '#60a5fa',
    headerTextColor: settings.headerTextColor || '#1e293b',
    buttonColor: settings.buttonColor || '#2563eb',
    poweredByText: settings.poweredByText || 'Powered by Accessibility Widget',
    poweredByColor: settings.poweredByColor || '#64748b'
  };
};
