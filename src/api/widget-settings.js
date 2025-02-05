import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client key from query parameter
  const clientKey = req.query.clientKey;

  if (!clientKey) {
    return res.status(400).json({ error: 'Client key is required' });
  }

  try {
    // Verify client exists and is active
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('client_key', clientKey)
      .eq('status', 'active')
      .single();

    if (clientError || !clientData) {
      return res.status(404).json({ error: 'Invalid or inactive client' });
    }

    // Get widget settings
    const { data: settings, error: settingsError } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (settingsError) {
      return res.status(500).json({ error: 'Failed to load settings' });
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Widget settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
