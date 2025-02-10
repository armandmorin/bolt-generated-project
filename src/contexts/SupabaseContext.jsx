import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getCurrentSession } from '../lib/supabase';

const SupabaseContext = createContext({});

export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session and user
    const initializeAuth = async () => {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession);

        if (currentSession) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            // Get additional user data from your users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', currentUser.id)
              .single();

            if (userError) throw userError;

            setUser({
              ...currentUser,
              ...userData
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);

      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && userData) {
          setUser({
            ...session.user,
            ...userData
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    supabase
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
