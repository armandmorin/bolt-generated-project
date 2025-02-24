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
  // Explicitly set headers to resolve 406 error
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Prefer': 'return=representation'
  }
});

// Robust user role retrieval
export const getCurrentUserRole = async () => {
  try {
    // First, get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No active session');
      return null;
    }

    const userId = session.user.id;

    // Check user metadata first (primary method)
    const userMetadataRole = session.user.user_metadata?.role;
    if (userMetadataRole) {
      console.log('Role from user metadata:', userMetadataRole);
      return userMetadataRole;
    }

    // Fallback: Query users table with maybeSingle() to handle no rows
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();  // Use maybeSingle() to handle cases with no rows

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    if (data) {
      console.log('Role from users table:', data.role);
      return data.role;
    }

    // If no role found, default to 'client'
    console.warn('No role found, defaulting to client');
    return 'client';
  } catch (error) {
    console.error('Unexpected error in getCurrentUserRole:', error);
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
          role: session.user.user_metadata?.role || 'client'
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

// Utility for logging Supabase-related errors
export const logSupabaseError = (context, error) => {
  console.group('Supabase Error');
  console.error(`Context: ${context}`);
  console.error('Error Details:', error);
  console.groupEnd();
};
