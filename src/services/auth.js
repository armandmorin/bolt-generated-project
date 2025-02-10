import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  try {
    // First authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('No user data returned');
    }

    // Get user data from users table with the session
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('User data error:', userError);
      throw new Error('Error fetching user data');
    }

    if (!userData) {
      throw new Error('User not found in database');
    }

    // Return combined user data
    return {
      id: authData.user.id,
      email: userData.email,
      role: userData.role,
      name: userData.name
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;
    if (!userData) return null;

    return {
      id: user.id,
      email: userData.email,
      role: userData.role,
      name: userData.name
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
