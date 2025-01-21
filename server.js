import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Widget settings endpoint
app.get('/api/widget-settings/:clientKey', async (req, res) => {
  try {
    const { clientKey } = req.params;
    
    // Get the client from storage
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.scriptKey === clientKey);
    
    if (!client || client.status !== 'active') {
      return res.status(404).json({ error: 'Invalid or inactive client key' });
    }

    // Get widget settings
    const widgetSettings = JSON.parse(localStorage.getItem('widgetSettings') || '{}');
    
    res.json({
      headerColor: widgetSettings.headerColor || '#60a5fa',
      headerTextColor: widgetSettings.headerTextColor || '#1e293b',
      buttonColor: widgetSettings.buttonColor || '#2563eb',
      poweredByText: widgetSettings.poweredByText || 'Powered by Accessibility Widget',
      poweredByColor: widgetSettings.poweredByColor || '#64748b'
    });
  } catch (error) {
    console.error('Error fetching widget settings:', error);
    res.status(500).json({ error: 'Failed to load widget settings' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
