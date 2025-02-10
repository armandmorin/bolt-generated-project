import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  try {
    // First authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Invalid login credentials');
    }

    if (!authData?.user) {
      throw new Error('No user data returned');
    }

    // Then get the user's role from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('User data error:', userError);
      throw new Error('Error fetching user data');
    }

    if (!userData) {
      throw new Error('User not found in database');
    }

    return {
      ...authData.user,
      role: userData.role,
      name: userData.name,
      company: userData.company
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .single();

    if (userError) throw userError;
    
    return {
      ...authUser,
      role: userData.role,
      name: userData.name,
      company: userData.company
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
