import { supabase } from './supabase';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  category_id?: string | null;
  transmission: string;
  fuel_type: string;
  seats: number;
  color?: string | null;
  price_per_day: number;
  status: 'available' | 'rented' | 'maintenance';
  image_url?: string | null;
  features?: string[] | any;
  description?: string | null;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  // Joined category data
  vehicle_categories?: {
    id: string;
    name: string;
  } | null;
}

export interface VehicleStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
}

/**
 * Vehicle management service
 */
export const vehicleService = {
  /**
   * Get all vehicles with category
   */
  async getAll(): Promise<{ data: Vehicle[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_categories:category_id (id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      return { data: null, error: error.message || 'Failed to fetch vehicles' };
    }
  },

  /**
   * Get vehicle by ID
   */
  async getById(id: string): Promise<{ data: Vehicle | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching vehicle:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      return { data: null, error: error.message || 'Failed to fetch vehicle' };
    }
  },

  /**
   * Get vehicle statistics
   */
  async getStats(): Promise<{ data: VehicleStats | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('status');

      if (error) {
        console.error('Error fetching vehicle stats:', error);
        return { data: null, error: error.message };
      }

      const stats: VehicleStats = {
        total: data?.length || 0,
        available: data?.filter((v) => v.status === 'available').length || 0,
        rented: data?.filter((v) => v.status === 'rented').length || 0,
        maintenance: data?.filter((v) => v.status === 'maintenance').length || 0,
      };

      return { data: stats, error: null };
    } catch (error: any) {
      console.error('Error fetching vehicle stats:', error);
      return { data: null, error: error.message || 'Failed to fetch stats' };
    }
  },

  /**
   * Search vehicles
   */
  async search(query: string, status?: string): Promise<{ data: Vehicle[] | null; error: string | null }> {
    try {
      let queryBuilder = supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_categories:category_id (id, name)
        `);

      if (status && status !== 'all') {
        queryBuilder = queryBuilder.eq('status', status);
      }

      const { data, error } = await queryBuilder
        .or(`brand.ilike.%${query}%,model.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching vehicles:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error searching vehicles:', error);
      return { data: null, error: error.message || 'Failed to search vehicles' };
    }
  },

  /**
   * Create a new vehicle
   */
  async create(vehicleData: {
    brand: string;
    model: string;
    category_id?: string | null;
    color?: string | null;
    transmission: 'automatic' | 'manual';
    fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    seats: number;
    features?: string[];
    price_per_day: number;
    status: 'available' | 'rented' | 'maintenance' | 'retired';
    is_featured?: boolean;
    image_url?: string | null;
  }): Promise<{ data: Vehicle | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          features: vehicleData.features || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating vehicle:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      return { data: null, error: error.message || 'Failed to create vehicle' };
    }
  },

  /**
   * Update an existing vehicle
   */
  async update(
    id: string,
    vehicleData: Partial<{
      brand: string;
      model: string;
      category_id: string | null;
      color: string | null;
      transmission: 'automatic' | 'manual';
      fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
      seats: number;
      features: string[];
      price_per_day: number;
      status: 'available' | 'rented' | 'maintenance' | 'retired';
      is_featured: boolean;
      image_url: string | null;
    }>
  ): Promise<{ data: Vehicle | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vehicle:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      return { data: null, error: error.message || 'Failed to update vehicle' };
    }
  },

  /**
   * Delete a vehicle
   */
  async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting vehicle:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      return { success: false, error: error.message || 'Failed to delete vehicle' };
    }
  },
};

export default vehicleService;
