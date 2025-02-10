import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  try {
    // First authenticate with Supabase Auth
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Invalid login credentials');
    }

    if (!session?.user) {
      throw new Error('No user data returned');
    }

    // Get user data from public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('User data error:', userError);
      throw new Error('Error fetching user data');
    }

    return {
      ...session.user,
      ...userData
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) throw authError;
    if (!session?.user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) throw userError;

    return {
      ...session.user,
      ...userData
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
