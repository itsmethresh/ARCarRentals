import { supabase } from './supabase';

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: string;
  // Joined profile data (array from Supabase join, but we'll only use first)
  profiles?: Array<{
    phone: string;
    address?: string;
    city?: string;
  }> | {
    phone: string;
    address?: string;
    city?: string;
  };
  // Aggregated data
  booking_count?: number;
  total_spent?: number;
  last_booking_date?: string;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  totalRevenue: number;
  avgBookingsPerCustomer: number;
}

/**
 * Customer management service
 */
export const customerService = {
  /**
   * Get all customers
   */
  async getAll(): Promise<{ data: Customer[] | null; error: string | null }> {
    try {
      // Get customers (users with role 'customer')
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          phone_number,
          role,
          is_active,
          created_at,
          profiles:id (phone, address, city)
        `)
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching customers:', usersError);
        return { data: null, error: usersError.message };
      }

      // Get booking counts and totals for each customer
      const customersWithStats = await Promise.all(
        (users || []).map(async (user) => {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('total_amount, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          return {
            ...user,
            booking_count: bookings?.length || 0,
            total_spent: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
            last_booking_date: bookings?.[0]?.created_at || null,
          };
        })
      );

      return { data: customersWithStats, error: null };
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      return { data: null, error: error.message || 'Failed to fetch customers' };
    }
  },

  /**
   * Get customer statistics
   */
  async getStats(): Promise<{ data: CustomerStats | null; error: string | null }> {
    try {
      const { data: customers, error: customersError } = await supabase
        .from('users')
        .select('id, is_active')
        .eq('role', 'customer');

      if (customersError) {
        return { data: null, error: customersError.message };
      }

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_amount');

      if (bookingsError) {
        return { data: null, error: bookingsError.message };
      }

      const stats: CustomerStats = {
        total: customers?.length || 0,
        active: customers?.filter((c) => c.is_active).length || 0,
        inactive: customers?.filter((c) => !c.is_active).length || 0,
        totalRevenue: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        avgBookingsPerCustomer: customers?.length 
          ? Math.round((bookings?.length || 0) / customers.length) 
          : 0,
      };

      return { data: stats, error: null };
    } catch (error: any) {
      console.error('Error fetching customer stats:', error);
      return { data: null, error: error.message || 'Failed to fetch stats' };
    }
  },

  /**
   * Search customers
   */
  async search(query: string, status?: string): Promise<{ data: Customer[] | null; error: string | null }> {
    try {
      let queryBuilder = supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          phone_number,
          role,
          is_active,
          created_at,
          profiles:id (phone, address, city)
        `)
        .eq('role', 'customer');

      if (status === 'active') {
        queryBuilder = queryBuilder.eq('is_active', true);
      } else if (status === 'inactive') {
        queryBuilder = queryBuilder.eq('is_active', false);
      }

      const { data: users, error } = await queryBuilder
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching customers:', error);
        return { data: null, error: error.message };
      }

      // Get booking stats for filtered customers
      const customersWithStats = await Promise.all(
        (users || []).map(async (user) => {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('total_amount, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          return {
            ...user,
            booking_count: bookings?.length || 0,
            total_spent: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
            last_booking_date: bookings?.[0]?.created_at || null,
          };
        })
      );

      return { data: customersWithStats, error: null };
    } catch (error: any) {
      console.error('Error searching customers:', error);
      return { data: null, error: error.message || 'Failed to search customers' };
    }
  },
};

export default customerService;
