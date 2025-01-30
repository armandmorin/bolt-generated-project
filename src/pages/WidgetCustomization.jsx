import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AccessibilityWidget from '../components/AccessibilityWidget';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/widgetCustomization.module.css';

const WidgetCustomization = () => {
  const [widgetSettings, setWidgetSettings] = useState({
    header_color: '#60a5fa',
    header_text_color: '#1e293b',
    button_color: '#2563eb',
    powered_by_text: 'Powered by Accessibility Widget',
    powered_by_color: '#64748b'
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      // First ensure the table exists
      await supabase.rpc('create_global_settings_table');
      
      // Get the global settings
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default
          const { data: newData, error: createError } = await supabase
            .from('global_widget_settings')
            .insert([widgetSettings])
            .select()
            .single();

          if (createError) throw createError;
          setWidgetSettings(newData);
        } else {
          throw error;
        }
      } else if (data) {
        setWidgetSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('Error loading settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component code remains the same...
};

export default WidgetCustomization;
