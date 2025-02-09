import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper function to get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Helper function to get brand settings
export const getBrandSettings = async (userId) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('admin_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;
};

// Helper function to create or update brand settings
export const upsertBrandSettings = async (settings) => {
  const { error } = await supabase
    .from('brand_settings')
    .upsert(settings)
    .select()
    .single();

  if (error) throw error;
};
