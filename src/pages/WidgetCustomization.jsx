import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import styles from '../styles/widgetCustomization.module.css';

const defaultSettings = {
  // Header Settings
  headerColor: '#60a5fa',
  headerTextColor: '#1e293b',
  headerTitle: 'Accessibility Settings',
  headerLogo: '',

  // Button Settings
  buttonColor: '#2563eb',
  buttonSize: '64px',
  buttonPosition: 'bottom-right',
  buttonIcon: 'default',
  customIconUrl: '',

  // Footer Settings
  poweredByText: 'Powered by Our Company',
  poweredByColor: '#64748b',
  footerBackground: '#ffffff'
};

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [clientKey, setClientKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    initializeClientAndSettings();
  }, []);

  const initializeClientAndSettings = async () => {
    try {
      setLoading(true);
      let existingClientKey = localStorage.getItem('clientKey');
      
      if (!existingClientKey) {
        const newClientKey = 'client_' + Math.random().toString(36).substr(2, 9);
        
        const { error: clientError } = await supabase
          .from('clients')
          .insert([{
            client_key: newClientKey,
            name: 'Default Client',
            email: 'admin@example.com',
            status: 'active'
          }]);

        if (clientError) throw clientError;

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
        // Map database columns to state properties
        const mappedSettings = {
          ...defaultSettings,
          headerColor: settings.header_color,
          headerTextColor: settings.header_text_color,
          headerTitle: settings.header_title,
          buttonColor: settings.button_color,
          buttonSize: settings.button_size,
          buttonPosition: settings.button_position,
          poweredByText: settings.powered_by_text,
          poweredByColor: settings.powered_by_color,
        };
        setWidgetSettings(mappedSettings);
      } else {
        // Create default settings
        const defaultDbSettings = {
          client_key: existingClientKey,
          header_color: defaultSettings.headerColor,
          header_text_color: defaultSettings.headerTextColor,
          header_title: defaultSettings.headerTitle,
          button_color: defaultSettings.buttonColor,
          button_size: defaultSettings.buttonSize,
          button_position: defaultSettings.buttonPosition,
          powered_by_text: defaultSettings.poweredByText,
          powered_by_color: defaultSettings.poweredByColor,
        };

        const { error: insertError } = await supabase
          .from('widget_settings')
          .insert([defaultDbSettings]);

        if (insertError) throw insertError;
        setWidgetSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      alert('Error initializing settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWidgetSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!clientKey) {
      alert('No client key found. Please refresh the page.');
      return;
    }

    setLoading(true);
    try {
      // Map state properties to database column names
      const dbSettings = {
        client_key: clientKey,
        header_color: widgetSettings.headerColor,
        header_text_color: widgetSettings.headerTextColor,
        header_title: widgetSettings.headerTitle,
        button_color: widgetSettings.buttonColor,
        button_size: widgetSettings.buttonSize,
        button_position: widgetSettings.buttonPosition,
        powered_by_text: widgetSettings.poweredByText,
        powered_by_color: widgetSettings.poweredByColor,
      };

      const { error } = await supabase
        .from('widget_settings')
        .upsert(dbSettings, {
          onConflict: 'client_key',
          returning: 'minimal'
        });

      if (error) throw error;
      alert('Widget settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  // (Keep all the JSX and other functions as they were)

  return (
    // ... existing JSX
  );
};

export default WidgetCustomization;
