import { supabase } from './supabase';

export async function setupGlobalSettings() {
  try {
    // Only check if settings exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (fetchError) {
      console.error('Error checking global settings:', fetchError);
    }
  } catch (error) {
    console.error('Setup error:', error);
  }
}
