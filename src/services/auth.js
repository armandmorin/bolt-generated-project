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

    // Fetch user data with service role
    const { data: userData, error: userError } = await supabase.auth.getUser(authData.session.access_token);

    if (userError) {
      console.error('User data error:', userError);
      throw new Error('Error fetching user data');
    }

    // If no user data found, create a fallback user object
    const userInfo = {
      id: authData.user.id,
      email: authData.user.email,
      role: 'admin', // Default role
      name: authData.user.email.split('@')[0] // Use email username as name
    };

    // Attempt to fetch additional user details if possible
    try {
      const { data: additionalData } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', authData.user.id)
        .single();

      if (additionalData) {
        userInfo.role = additionalData.role || userInfo.role;
        userInfo.name = additionalData.name || userInfo.name;
      }
    } catch (additionalError) {
      console.warn('Could not fetch additional user details:', additionalError);
    }

    return userInfo;
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

    // Create a fallback user object
    const userInfo = {
      id: user.id,
      email: user.email,
      role: 'admin', // Default role
      name: user.email.split('@')[0]
    };

    // Attempt to fetch additional user details
    try {
      const { data: additionalData } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', user.id)
        .single();

      if (additionalData) {
        userInfo.role = additionalData.role || userInfo.role;
        userInfo.name = additionalData.name || userInfo.name;
      }
    } catch (additionalError) {
      console.warn('Could not fetch additional user details:', additionalError);
    }

    return userInfo;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
