import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,  // Explicitly set to true
    storage: window.localStorage,  // Use localStorage for session storage
    autoRefreshToken: true,  // Automatically refresh the token
    detectSessionInUrl: true  // Detect session from URL (useful for OAuth)
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});

// Add a function to check and restore session
export const checkAndRestoreSession = async () => {
  try {
    // Check if there's a session in localStorage
    const localStorageSession = localStorage.getItem('supabase.auth.token');
    
    if (localStorageSession) {
      // Attempt to restore the session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session restoration error:', error);
        // Clear the invalid session
        await supabase.auth.signOut();
        return null;
      }
      
      return data.session;
    }
    
    return null;
  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
};

// Add a global error handler for auth
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  
  if (event === 'SIGNED_IN') {
    // Persist the session in localStorage
    localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    localStorage.setItem('user', JSON.stringify({
      email: session.user.email,
      id: session.user.id
    }));
  } else if (event === 'SIGNED_OUT') {
    // Clear the session from localStorage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('user');
  }
});
