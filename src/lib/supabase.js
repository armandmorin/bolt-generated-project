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
    'Prefer': 'return=representation'  // Changed from 'return=minimal'
  }
});

// Enhanced error handling for Supabase queries
export const handleSupabaseError = (error, context = 'Unknown') => {
  console.group(`Supabase Error - ${context}`);
  console.error('Error Details:', error);
  
  // Specific error handling
  if (error.code === 'PGRST116') {
    console.warn('No rows returned. This might be expected in some cases.');
    return null;
  }
  
  if (error.message.includes('406')) {
    console.error('Not Acceptable Error - Check API configuration');
    return null;
  }
  
  console.groupEnd();
  return error;
};

// Comprehensive session restoration function
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
    const userEmail = session.user.email;

    console.log('Attempting to retrieve role for:', {
      userId,
      userEmail
    });

    // Method 1: Check user metadata first
    const userMetadataRole = session.user.user_metadata?.role;
    if (userMetadataRole) {
      console.log('Role from user metadata:', userMetadataRole);
      return userMetadataRole;
    }

    // Method 2: Query users table with more detailed logging
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();  // Use single() instead of maybeSingle()

    console.log('Users table query result:', { data, error });

    if (error) {
      console.error('Error fetching user role:', error);
      handleSupabaseError(error, 'User Role Retrieval');
      return null;
    }

    if (data) {
      console.log('Role from users table:', data.role);
      return data.role;
    }

    console.warn('No role found for user');
    return null;
  } catch (error) {
    console.error('Unexpected error in getCurrentUserRole:', error);
    return null;
  }
};

// Global auth state change listener with more robust handling
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
