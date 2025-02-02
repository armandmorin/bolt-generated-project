
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
    powered_by_color: '#64748b',
    button_size: '64px',
    button_position: 'bottom-right'
  });

  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    loadSettings();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('global_widget_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_widget_settings'
        },
        (payload) => {
          if (payload.new) {
            setWidgetSettings(payload.new);
            setSettingsId(payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setWidgetSettings({
          header_color: data.header_color || '#60a5fa',
          header_text_color: data.header_text_color || '#1e293b',
          button_color: data.button_color || '#2563eb',
          powered_by_text: data.powered_by_text || 'Powered by Accessibility Widget',
          powered_by_color: data.powered_by_color || '#64748b',
          button_size: data.button_size || '64px',
          button_position: data.button_position || 'bottom-right'
        });
        setSettingsId(data.id);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('Error loading settings. Using defaults.');
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
      let response;
      
      const settingsData = {
        header_color: widgetSettings.header_color,
        header_text_color: widgetSettings.header_text_color,
        button_color: widgetSettings.button_color,
        powered_by_text: widgetSettings.powered_by_text,
        powered_by_color: widgetSettings.powered_by_color,
        button_size: widgetSettings.button_size,
        button_position: widgetSettings.button_position
      };

      if (settingsId) {
        // Update existing settings
        response = await supabase
          .from('global_widget_settings')
          .update(settingsData)
          .eq('id', settingsId);
      } else {
        //