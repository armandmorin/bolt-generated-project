import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState({
    headerColor: '#60a5fa',
    headerTextColor: '#1e293b',
    buttonColor: '#2563eb',
    poweredByText: 'Powered by Accessibility Widget',
    poweredByColor: '#64748b',
    buttonSize: '64px',
    buttonPosition: 'bottom-right'
  });

  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setWidgetSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = (setting, value) => {
    setWidgetSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('global_widget_settings')
        .upsert(widgetSettings, { onConflict: 'id' });

      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Rest of your component code remains the same...
}
