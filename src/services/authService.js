import { supabase } from '../supabaseClient';

export const authService = {
  // Login with email and password
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error.message);
      return { data: null, error: error.message };
    }
  },

  // Register new user
  async register(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Registration error:', error.message);
      return { data: null, error: error.message };
    }
  },

  // Logout user
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error.message);
      return { error: error.message };
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get session error:', error.message);
      return { data: null, error: error.message };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error.message);
      return { error: error.message };
    }
  }
}; 