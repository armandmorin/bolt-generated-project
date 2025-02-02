import { supabase } from './supabase';

export async function setupGlobalSettings() {
  try {
    // Check if global settings table exists and has default settings
    const { data: existingSettings, error: fetchError } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking global settings:', fetchError);
      return;
    }

    // If no settings exist, create default settings
    if (!existingSettings) {
      const defaultSettings = {
        header_color: '#60a5fa',
        header_text_color: '#1e293b',
        button_color: '#2563eb',
        powered_by_text: 'Powered by Accessibility Widget',
        powered_by_color: '#64748b',
        button_size: '64px',
        button_position: 'bottom-right'
      };

      const { error: insertError } = await supabase
        .from('global_widget_settings')
        .insert([defaultSettings]);

      if (insertError) {
        console.error('Error creating default settings:', insertError);
        return;
      }
    }

    // Subscribe to settings changes
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
          console.log('Settings updated:', payload);
          // Update localStorage when DB changes
          if (payload.new) {
            localStorage.setItem('widgetPreview', JSON.stringify(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Setup error:', error);
  }
}

export async function updateGlobalSettings(settings) {
  try {
    // Ensure only allowed columns are updated
    const allowedSettings = {
      header_color: settings.header_color,
      header_text_color: settings.header_text_color,
      button_color: settings.button_color,
      powered_by_text: settings.powered_by_text,
      powered_by_color: settings.powered_by_color
    };

    const { error } = await supabase
      .from('global_widget_settings')
      .update(allowedSettings)
      .eq('id', settings.id);

    if (error) throw error;
    
    // Update localStorage
    localStorage.setItem('widgetPreview', JSON.stringify({
      ...settings,
      ...allowedSettings
    }));

    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
}

export async function getGlobalSettings() {
  try {
    // First try to get from DB
    const { data: dbData, error: dbError } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    // If DB retrieval fails, check localStorage
    if (dbError) {
      const localSettings = localStorage.getItem('widgetPreview');
      if (localSettings) {
        return JSON.parse(localSettings);
      }
    }

    return dbData || null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}
