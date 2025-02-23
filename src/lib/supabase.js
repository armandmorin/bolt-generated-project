import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsUYsIFAiL37o';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: {
      // Custom storage implementation to ensure session persistence
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error('Error retrieving session:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error storing session:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing session:', error);
        }
      }
    },
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Enhanced session restoration function
export const checkAndRestoreSession = async () => {
  try {
    // First, attempt to get the current session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session retrieval error:', error);
      
      // Try to restore from localStorage
      const storedSession = localStorage.getItem('supabase.auth.token');
      
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          
          // Manually set the session if it exists
          if (parsedSession) {
            await supabase.auth.setSession({
              access_token: parsedSession.access_token,
              refresh_token: parsedSession.refresh_token
            });
          }
        } catch (parseError) {
          console.error('Error parsing stored session:', parseError);
        }
      }
      
      return null;
    }

    // If session exists, update localStorage
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      localStorage.setItem('user', JSON.stringify({
        email: data.session.user.email,
        id: data.session.user.id
      }));
    }

    return data.session;
  } catch (error) {
    console.error('Comprehensive session check failed:', error);
    return null;
  }
};

// Global auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session);
  
  switch (event) {
    case 'SIGNED_IN':
      if (session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session));
        localStorage.setItem('user', JSON.stringify({
          email: session.user.email,
          id: session.user.id,
          role: session.user.user_metadata.role || null
        }));
      }
      break;
    
    case 'SIGNED_OUT':
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('user');
      break;
    
    case 'TOKEN_REFRESHED':
      if (session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session));
      }
      break;
  }
});

// Utility function to get current user role
export const getCurrentUserRole = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser).role : null;
};
