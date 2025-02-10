import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  try {
    // Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    // If authentication is successful, create a user object
    const userInfo = {
      id: data.user.id,
      email: data.user.email,
      role: 'admin', // Default role
      name: data.user.email.split('@')[0]
    };

    // Optional: Try to get additional user info if needed
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', data.user.id)
        .single();

      if (userData) {
        userInfo.role = userData.role || userInfo.role;
        userInfo.name = userData.name || userInfo.name;
      }
    } catch (additionalError) {
      console.warn('Could not fetch additional user details', additionalError);
    }

    return userInfo;
  } catch (error) {
    console.error('Login process error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;

    // Create user object
    const userInfo = {
      id: user.id,
      email: user.email,
      role: 'admin', // Default role
      name: user.email.split('@')[0]
    };

    // Optional: Try to get additional user info
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', user.id)
        .single();

      if (userData) {
        userInfo.role = userData.role || userInfo.role;
        userInfo.name = userData.name || userInfo.name;
      }
    } catch (additionalError) {
      console.warn('Could not fetch additional user details', additionalError);
    }

    return userInfo;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
