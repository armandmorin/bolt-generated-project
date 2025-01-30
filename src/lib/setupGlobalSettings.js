import { supabase } from './supabase';

export async function setupGlobalSettings() {
  try {
    // Check if global settings exist
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
        powered_by_color: '#64748b'
      };

      const { error: insertError } = await supabase
        .from('global_widget_settings')
        .insert([defaultSettings]);

      if (insertError) {
        console.error('Error creating global settings:', insertError);
        return;
      }

      console.log('Global settings created successfully');
    }
  } catch (error) {
    console.error('Setup error:', error);
  }
}
