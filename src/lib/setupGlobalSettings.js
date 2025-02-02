import { supabase } from './supabase';

const STORAGE_KEY = 'widgetSettings';

export async function setupGlobalSettings() {
  try {
    const { data: existingSettings, error: fetchError } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking global settings:', fetchError);
      return;
    }

    if (!existingSettings) {
      const defaultSettings = {
        header_color: '#60a5fa',
        header_text_color: '#1e293b',
        button_color: '#2563eb',
        powered_by_text: 'Powered by Accessibility Widget',
        powered_by_color: '#64748b'
      };

      const { error: insertError } = await supabase
        .from('global_widget_settings')
        .insert([defaultSettings]);

      if (insertError) {
        console.error('Error creating default settings:', insertError);
      }
    }
  } catch (error) {
    console.error('Setup error:', error);
  }
}

export async function updateGlobalSettings(settings) {
  try {
    // Split settings into database and local storage parts
    const dbSettings = {
      header_color: settings.header_color,
      header_text_color: settings.header_text_color,
      button_color: settings.button_color,
      powered_by_text: settings.powered_by_text,
      powered_by_color: settings.powered_by_color
    };

    const localSettings = {
      ...dbSettings,
      button_size: settings.button_size,
      button_position: settings.button_position
    };

    // Save to localStorage first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localSettings));

    // Then save to database
    const { data: existingSettings } = await supabase
      .from('global_widget_settings')
      .select('id')
      .single();

    let result;
    if (!existingSettings) {
      result = await supabase
        .from('global_widget_settings')
        .insert([dbSettings]);
    } else {
      result = await supabase
        .from('global_widget_settings')
        .update(dbSettings)
        .eq('id', existingSettings.id);
    }

    if (result.error) {
      console.error('Database save error:', result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
}

export async function getGlobalSettings() {
  try {
    // Try to get settings from localStorage first
    const localSettings = localStorage.getItem(STORAGE_KEY);
    const parsedLocalSettings = localSettings ? JSON.parse(localSettings) : null;

    // Then get database settings
    const { data: dbSettings, error } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database fetch error:', error);
    }

    // Combine settings with proper fallbacks
    return {
      header_color: parsedLocalSettings?.header_color || dbSettings?.header_color || '#60a5fa',
      header_text_color: parsedLocalSettings?.header_text_color || dbSettings?.header_text_color || '#1e293b',
      button_color: parsedLocalSettings?.button_color || dbSettings?.button_color || '#2563eb',
      powered_by_text: parsedLocalSettings?.powered_by_text || dbSettings?.powered_by_text || 'Powered by Accessibility Widget',
      powered_by_color: parsedLocalSettings?.powered_by_color || dbSettings?.powered_by_color || '#64748b',
      button_size: parsedLocalSettings?.button_size || '64px',
      button_position: parsedLocalSettings?.button_position || 'bottom-right'
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}
