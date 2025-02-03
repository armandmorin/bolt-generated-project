import { supabase } from './supabase';

async function clearDatabaseSettings() {
  try {
    // Delete all records from global_widget_settings
    const { error } = await supabase
      .from('global_widget_settings')
      .delete()
      .not('id', 'is', null); // This will match all records

    if (error) {
      console.error('Error clearing database:', error);
      return false;
    }
    
    console.log('Database cleared successfully');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Execute the clear function
clearDatabaseSettings();
