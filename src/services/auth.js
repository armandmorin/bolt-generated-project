import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  try {
    // For demo purposes, hardcode super admin credentials
    if (email === 'armandmorin@gmail.com' && password === '1armand') {
      return {
        id: 'super-admin-id',
        email: 'armandmorin@gmail.com',
        role: 'superadmin'
      };
    }

    // For demo purposes, hardcode admin credentials
    if (email === 'onebobdavis@gmail.com' && password === '1armand') {
      return {
        id: 'admin-id',
        email: 'onebobdavis@gmail.com',
        role: 'admin'
      };
    }

    throw new Error('Invalid login credentials');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  // Get user from localStorage
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
