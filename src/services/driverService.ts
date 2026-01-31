import { supabase } from './supabase';

export interface Driver {
  id: string;
  full_name: string;
  date_of_birth?: string;
  phone_number: string;
  email?: string;
  profile_photo?: string;
  license_number: string;
  license_expiry: string;
  years_of_experience: number;
  status: 'available' | 'on_duty' | 'unavailable';
  rate_per_day: number;
  languages_spoken?: string[];
  specializations?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverStats {
  total: number;
  available: number;
  on_duty: number;
  unavailable: number;
}

/**
 * Driver management service
 */
export const driverService = {
  /**
   * Get all drivers
   */
  async getAll(): Promise<{ data: Driver[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching drivers:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching drivers:', error);
      return { data: null, error: error.message || 'Failed to fetch drivers' };
    }
  },

  /**
   * Get driver by ID
   */
  async getById(id: string): Promise<{ data: Driver | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching driver:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching driver:', error);
      return { data: null, error: error.message || 'Failed to fetch driver' };
    }
  },

  /**
   * Get driver statistics
   */
  async getStats(): Promise<{ data: DriverStats | null; error: string | null }> {
    try {
      const { data: drivers, error } = await supabase
        .from('drivers')
        .select('status');

      if (error) {
        console.error('Error fetching driver stats:', error);
        return { data: null, error: error.message };
      }

      const stats: DriverStats = {
        total: drivers?.length || 0,
        available: drivers?.filter(d => d.status === 'available').length || 0,
        on_duty: drivers?.filter(d => d.status === 'on_duty').length || 0,
        unavailable: drivers?.filter(d => d.status === 'unavailable').length || 0,
      };

      return { data: stats, error: null };
    } catch (error: any) {
      console.error('Error fetching driver stats:', error);
      return { data: null, error: error.message || 'Failed to fetch driver statistics' };
    }
  },

  /**
   * Search drivers
   */
  async search(
    query: string,
    status?: Driver['status']
  ): Promise<{ data: Driver[] | null; error: string | null }> {
    try {
      let supabaseQuery = supabase
        .from('drivers')
        .select('*');

      if (status) {
        supabaseQuery = supabaseQuery.eq('status', status);
      }

      if (query) {
        supabaseQuery = supabaseQuery.or(
          `full_name.ilike.%${query}%,phone_number.ilike.%${query}%,license_number.ilike.%${query}%`
        );
      }

      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching drivers:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error searching drivers:', error);
      return { data: null, error: error.message || 'Failed to search drivers' };
    }
  },

  /**
   * Get available drivers
   */
  async getAvailable(): Promise<{ data: Driver[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('status', 'available')
        .order('rate_per_day', { ascending: true });

      if (error) {
        console.error('Error fetching available drivers:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching available drivers:', error);
      return { data: null, error: error.message || 'Failed to fetch available drivers' };
    }
  },
};

export default driverService;
