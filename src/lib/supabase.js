import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  throw new Error('Supabase URL and Anon Key must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: {
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
  },
  // Add explicit headers to resolve 406 error
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Remove the problematic .on() method
// Instead, use a more robust error handling approach
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  
  if (error.message.includes('406')) {
    console.error('Not Acceptable Error - Check API configuration');
    // Potentially trigger a re-authentication or logout
    return false;
  }
  
  // Add more specific error handling as needed
  return true;
};

// Enhanced session restoration function
export const checkAndRestoreSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session retrieval error:', error);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Comprehensive session check failed:', error);
    return null;
  }
};

// Global auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
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

// Utility function to get current user role with more robust error handling
export const getCurrentUserRole = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No active session');
      return null;
    }

    const userId = session.user.id;

    // Use more explicit query with proper error handling
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role || null;
  } catch (error) {
    console.error('Unexpected error in getCurrentUserRole:', error);
    return null;
  }
};

// Add global error logging
export const logSupabaseError = (context, error) => {
  console.group('Supabase Error');
  console.error(`Context: ${context}`);
  console.error('Error Details:', error);
  console.groupEnd();
};
