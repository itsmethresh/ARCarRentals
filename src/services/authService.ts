import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  role: 'staff' | 'admin';
  isActive: boolean;
}

/**
 * Authentication service using Supabase Auth
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Sign in with email and password
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        return { user: null, error: 'Invalid email or password' };
      }

      if (!authData.user) {
        return { user: null, error: 'Login failed' };
      }

      console.log('Auth successful for user:', authData.user.id);

      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, is_active')
        .eq('id', authData.user.id)
        .single();

      console.log('User query result:', { userData, userError });

      if (userError) {
        console.error('User query error:', userError);
        // More detailed error message
        if (userError.code === 'PGRST116') {
          return { user: null, error: 'User record not found. Please contact support.' };
        }
        if (userError.message?.includes('RLS') || userError.message?.includes('policy')) {
          return { user: null, error: 'Permission error. Please contact support.' };
        }
        return { user: null, error: `Database error: ${userError.message}` };
      }

      if (!userData) {
        return { user: null, error: 'User not found in database' };
      }

      // Check if account is active
      if (!userData.is_active) {
        return { user: null, error: 'Account is inactive. Please contact support.' };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userData.role as 'staff' | 'admin',
        isActive: userData.is_active,
      };

      console.log('Login successful for user:', user);
      return { user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'An error occurred during login' };
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return null;

      // Get user data from users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, email, role, is_active')
        .eq('id', authUser.id)
        .single();

      if (error || !userData || !userData.is_active) return null;

      return {
        id: userData.id,
        email: userData.email,
        role: userData.role as 'staff' | 'admin',
        isActive: userData.is_active,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Check if user is admin
   */
  isAdmin(user: User | null): boolean {
    return user?.role === 'admin';
  },

  /**
   * Check if user is staff or admin
   */
  isStaffOrAdmin(user: User | null): boolean {
    return user?.role === 'admin' || user?.role === 'staff';
  },
};

export default authService;
