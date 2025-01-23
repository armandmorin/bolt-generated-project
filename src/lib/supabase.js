import { createClient } from '@supabase/supabase-js';

// Your Supabase project URL and anon key
const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Add a simple test function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('clients').select('count');
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { success: false, error: error.message };
  }
};
