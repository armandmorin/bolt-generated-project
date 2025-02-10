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

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (userError) throw userError;

    if (!userData) {
      throw new Error('User not found in database');
    }

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
