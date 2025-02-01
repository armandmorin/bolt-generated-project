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
        headerColor: '#60a5fa',
        headerTextColor: '#1e293b',
        buttonColor: '#2563eb',
        poweredByText: 'Powered by Accessibility Widget',
        poweredByColor: '#64748b',
        buttonSize: '64px',
        buttonPosition: 'bottom-right'
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
          // You can add any additional handling for settings changes here
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
    const { error } = await supabase
      .from('global_widget_settings')
      .update(settings)
      .eq('id', settings.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
}

export async function getGlobalSettings() {
  try {
    const { data, error } = await supabase
      .from('global_widget_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

// SQL for creating the global_widget_settings table:
/*
create table if not exists global_widget_settings (
  id uuid default uuid_generate_v4() primary key,
  header_color varchar(255) default '#60a5fa',
  header_text_color varchar(255) default '#1e293b',
  button_color varchar(255) default '#2563eb',
  powered_by_text varchar(255) default 'Powered by Accessibility Widget',
  powered_by_color varchar(255) default '#64748b',
  button_size varchar(255) default '64px',
  button_position varchar(255) default 'bottom-right',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable realtime
alter publication supabase_realtime add table global_widget_settings;

-- Create trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_global_widget_settings_updated_at
    before update on global_widget_settings
    for each row
    execute procedure update_updated_at_column();
*/
