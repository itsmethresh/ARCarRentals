import { supabase, isSupabaseConfigured } from './supabase';
import type { Car, Testimonial } from '@/types';

/**
 * Database service for fetching data from Supabase
 * Demonstrates real data fetching with graceful handling when data is unavailable
 */
export const databaseService = {
  /**
   * Fetch featured cars from Supabase
   * Returns empty array if Supabase is not configured or query fails
   */
  async getFeaturedCars(): Promise<Car[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured cars:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch featured cars:', error);
      return [];
    }
  },

  /**
   * Fetch all available cars from Supabase
   * Returns empty array if Supabase is not configured or query fails
   */
  async getCars(limit: number = 10, offset: number = 0): Promise<Car[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('available', true)
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching cars:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      return [];
    }
  },

  /**
   * Fetch testimonials from Supabase
   * Returns empty array if Supabase is not configured or query fails
   */
  async getTestimonials(): Promise<Testimonial[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching testimonials:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      return [];
    }
  },

  /**
   * Fetch company statistics from Supabase
   * Returns null if Supabase is not configured or query fails
   */
  async getCompanyStats(): Promise<{
    happyCustomers: number;
    vehicles: number;
    yearsExperience: number;
  } | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('company_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching company stats:', error.message);
        return null;
      }

      // Map snake_case database columns to camelCase
      return data ? {
        happyCustomers: data.happy_customers ?? 0,
        vehicles: data.total_vehicles ?? 0,
        yearsExperience: data.years_experience ?? 0,
      } : null;
    } catch (error) {
      console.error('Failed to fetch company stats:', error);
      return null;
    }
  },

  /**
   * Search cars by criteria
   */
  async searchCars(params: {
    location?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Car[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('available', true);

      if (params.category) {
        query = query.eq('category', params.category);
      }

      if (params.minPrice) {
        query = query.gte('price_per_day', params.minPrice);
      }

      if (params.maxPrice) {
        query = query.lte('price_per_day', params.maxPrice);
      }

      const { data, error } = await query.order('price_per_day', { ascending: true });

      if (error) {
        console.error('Error searching cars:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to search cars:', error);
      return [];
    }
  },
};

export default databaseService;
