import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'customer' | 'staff' | 'admin';
  isActive: boolean;
  profile?: {
    phone: string;
    address?: string;
    city?: string;
    avatarUrl?: string;
  };
}

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

/**
 * Authentication service using Supabase Auth
 */
export const authService = {
  /**
   * Register a new user with phone number
   */
  async register(data: RegisterData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if phone number already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('phone_number')
        .eq('phone_number', data.phoneNumber)
        .single();

      if (existingUser) {
        return { user: null, error: 'Phone number already registered' };
      }

      // Register user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            role: 'customer',
          },
        },
      });

      if (signUpError) {
        return { user: null, error: signUpError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create account' };
      }

      // Fetch the complete user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, profiles(*)')
        .eq('id', authData.user.id)
        .single();

      if (userError || !userData) {
        return { user: null, error: 'Account created but failed to fetch user data' };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        fullName: userData.profiles?.full_name || data.fullName,
        phoneNumber: userData.profiles?.phone_number || data.phoneNumber,
        role: userData.role as 'customer' | 'staff' | 'admin',
        isActive: userData.is_active,
        profile: {
          phone: userData.profiles?.phone || data.phoneNumber,
          address: userData.profiles?.address,
          city: userData.profiles?.city,
          avatarUrl: userData.profiles?.avatar_url,
        },
      };

      return { user, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, error: 'An unexpected error occurred during registration' };
    }
  },

  /**
   * Login user with phone number and password
   */
  async loginWithPhone(phoneNumber: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Find user by phone number directly in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, full_name, phone_number, is_active')
        .eq('phone_number', phoneNumber)
        .single();

      if (userError || !userData) {
        return { user: null, error: 'Invalid phone number or password' };
      }

      // Check if account is active
      if (!userData.is_active) {
        return { user: null, error: 'Account is inactive. Please contact support.' };
      }

      // Sign in with email and password
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      });

      if (signInError) {
        return { user: null, error: 'Invalid phone number or password' };
      }

      if (!authData.user) {
        return { user: null, error: 'Login failed' };
      }

      // Fetch profile data if needed
      const { data: profileData } = await supabase
        .from('profiles')
        .select('phone, address, city, avatar_url')
        .eq('id', authData.user.id)
        .single();

      const user: User = {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name || '',
        phoneNumber: userData.phone_number || '',
        role: userData.role as 'customer' | 'staff' | 'admin',
        isActive: userData.is_active,
        profile: {
          phone: profileData?.phone || userData.phone_number || '',
          address: profileData?.address,
          city: profileData?.city,
          avatarUrl: profileData?.avatar_url,
        },
      };

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

      // Get user data from users table (includes phone_number and full_name)
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, email, role, full_name, phone_number, is_active')
        .eq('id', authUser.id)
        .single();

      if (error || !userData || !userData.is_active) return null;

      // Get additional profile data if needed
      const { data: profileData } = await supabase
        .from('profiles')
        .select('phone, address, city, avatar_url')
        .eq('id', authUser.id)
        .single();

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name || '',
        phoneNumber: userData.phone_number || '',
        role: userData.role as 'customer' | 'staff' | 'admin',
        isActive: userData.is_active,
        profile: {
          phone: profileData?.phone || userData.phone_number || '',
          address: profileData?.address,
          city: profileData?.city,
          avatarUrl: profileData?.avatar_url,
        },
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
