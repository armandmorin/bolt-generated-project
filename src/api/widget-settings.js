import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientKey = req.query.clientKey;

  if (!clientKey) {
    return res.status(400).json({ error: 'Client key is required' });
  }

  try {
    const { data: settings, error: settingsError } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (settingsError) {
      return res.status(500).json({ error: 'Failed to load settings' });
    }

    return res.status(200).json({
      headerColor: settings.headerColor,
      headerTextColor: settings.headerTextColor,
      buttonColor: settings.buttonColor,
      buttonSize: settings.buttonSize,
      poweredByText: settings.poweredByText,
      poweredByColor: settings.poweredByColor
    });
  } catch (error) {
    console.error('Widget settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
