// Add this function to your WidgetCustomization component
const initializeClientAndSettings = async () => {
  try {
    setLoading(true);
    
    // First, check if we already have a client key in localStorage
    let existingClientKey = localStorage.getItem('clientKey');
    
    if (!existingClientKey) {
      // Create a new client if we don't have one
      const newClientKey = 'client_' + Math.random().toString(36).substr(2, 9);
      
      // Insert new client
      const { error: clientError } = await supabase
        .from('clients')
        .insert([{
          client_key: newClientKey,
          name: 'Default Client',
          email: 'admin@example.com',
          status: 'active'
        }]);

      if (clientError) throw clientError;

      // Create default widget settings
      const { error: settingsError } = await supabase
        .from('widget_settings')
        .insert([{
          client_key: newClientKey,
          header_color: '#60a5fa',
          header_text_color: '#1e293b',
          button_color: '#2563eb',
          powered_by_text: 'Powered by Accessibility Widget',
          powered_by_color: '#64748b'
        }]);

      if (settingsError) throw settingsError;

      existingClientKey = newClientKey;
      localStorage.setItem('clientKey', newClientKey);
    }

    setClientKey(existingClientKey);

    // Get existing settings
    const { data: settings, error: settingsError } = await supabase
      .from('widget_settings')
      .select('*')
      .eq('client_key', existingClientKey)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }

    if (settings) {
      setWidgetSettings(settings);
    }
  } catch (error) {
    console.error('Error initializing:', error);
    alert('Error initializing settings. Please try again.');
  } finally {
    setLoading(false);
  }
};
