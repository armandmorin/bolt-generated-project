import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  try {
    // First authenticate with Supabase Auth
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    if (!session?.user) {
      throw new Error('No user data returned');
    }

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) throw userError;

    if (!userData) {
      throw new Error('User not found');
    }

    return {
      id: session.user.id,
      email: userData.email,
      role: userData.role,
      name: userData.name
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
