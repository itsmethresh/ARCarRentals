import { supabase } from './supabase';

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  vehicle_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location?: string;
  return_location?: string;
  total_days: number;
  base_price: number;
  extras_price?: number;
  discount_amount?: number;
  total_price: number;
  deposit_paid?: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  drive_option?: 'self-drive' | 'with-driver';
  start_time?: string;
  end_time?: string;
  payment_method?: 'pay_now' | 'pay_later';
  payment_receipt_url?: string;
  location_cost?: number;
  driver_cost?: number;
  pickup_delivery_location?: string;
  extras?: any;
  created_at: string;
  updated_at: string;
  // Joined data
  customers?: Customer | null;
  vehicles?: {
    brand: string;
    model: string;
    thumbnail?: string;
    image_url?: string;
  } | null;
  // Computed for display
  total_amount?: number;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  active: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}

export interface CreateBookingData {
  // Customer info
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  customer_city?: string;
  // Booking info
  vehicle_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location?: string;
  return_location?: string;
  total_days: number;
  base_price: number;
  extras_price?: number;
  discount_amount?: number;
  total_price: number;
  deposit_paid?: number;
  drive_option?: 'self-drive' | 'with-driver';
  start_time?: string;
  end_time?: string;
  payment_method?: 'pay_now' | 'pay_later';
  payment_receipt_url?: string;
  location_cost?: number;
  driver_cost?: number;
  pickup_delivery_location?: string;
  extras?: any;
}

/**
 * Booking management service
 */
export const bookingService = {
  /**
   * Get all bookings with customer and vehicle details
   */
  async getAll(): Promise<{ data: Booking[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers:customer_id (id, full_name, email, phone, address, city, created_at, updated_at),
          vehicles:vehicle_id (brand, model, thumbnail, image_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return { data: null, error: error.message };
      }

      // Map total_price to total_amount for display
      const mappedData = data?.map(b => ({
        ...b,
        total_amount: b.total_price || 0
      })) || null;

      return { data: mappedData, error: null };
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      return { data: null, error: error.message || 'Failed to fetch bookings' };
    }
  },

  /**
   * Get recent bookings (limit to last N)
   */
  async getRecent(limit: number = 5): Promise<{ data: Booking[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers:customer_id (id, full_name, email, phone, address, city, created_at, updated_at),
          vehicles:vehicle_id (brand, model, thumbnail, image_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent bookings:', error);
        return { data: null, error: error.message };
      }

      // Map total_price to total_amount for display
      const mappedData = data?.map(b => ({
        ...b,
        total_amount: b.total_price || 0
      })) || null;

      return { data: mappedData, error: null };
    } catch (error: any) {
      console.error('Error fetching recent bookings:', error);
      return { data: null, error: error.message || 'Failed to fetch recent bookings' };
    }
  },

  /**
   * Get booking statistics
   */
  async getStats(): Promise<{ data: BookingStats | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, total_price');

      if (error) {
        console.error('Error fetching booking stats:', error);
        return { data: null, error: error.message };
      }

      const stats: BookingStats = {
        total: data?.length || 0,
        pending: data?.filter((b) => b.status === 'pending').length || 0,
        confirmed: data?.filter((b) => b.status === 'confirmed').length || 0,
        active: data?.filter((b) => b.status === 'active').length || 0,
        completed: data?.filter((b) => b.status === 'completed').length || 0,
        cancelled: data?.filter((b) => b.status === 'cancelled').length || 0,
        totalRevenue: data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0,
      };

      return { data: stats, error: null };
    } catch (error: any) {
      console.error('Error fetching booking stats:', error);
      return { data: null, error: error.message || 'Failed to fetch stats' };
    }
  },

  /**
   * Search bookings
   */
  async search(query: string, status?: string): Promise<{ data: Booking[] | null; error: string | null }> {
    try {
      let queryBuilder = supabase
        .from('bookings')
        .select(`
          *,
          customers:customer_id (id, full_name, email, phone, address, city, created_at, updated_at),
          vehicles:vehicle_id (brand, model, thumbnail, image_url)
        `);

      if (status && status !== 'all') {
        queryBuilder = queryBuilder.eq('status', status);
      }

      if (query) {
        queryBuilder = queryBuilder.or(`booking_number.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching bookings:', error);
        return { data: null, error: error.message };
      }

      // Map total_price to total_amount for display
      const mappedData = data?.map(b => ({
        ...b,
        total_amount: b.total_price || 0
      })) || null;

      return { data: mappedData, error: null };
    } catch (error: any) {
      console.error('Error searching bookings:', error);
      return { data: null, error: error.message || 'Failed to search bookings' };
    }
  },

  /**
   * Create a new booking with customer
   * This will create or update the customer first, then create the booking
   */
  async create(bookingData: CreateBookingData): Promise<{ data: Booking | null; error: string | null }> {
    try {
      // Step 1: Check if customer exists by email or phone
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .or(`email.eq.${bookingData.customer_email},phone.eq.${bookingData.customer_phone}`)
        .limit(1)
        .single();

      let customerId: string;

      if (existingCustomer) {
        // Update existing customer
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update({
            full_name: bookingData.customer_name,
            email: bookingData.customer_email,
            phone: bookingData.customer_phone,
            address: bookingData.customer_address,
            city: bookingData.customer_city,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingCustomer.id)
          .select('id')
          .single();

        if (updateError) {
          console.error('Error updating customer:', updateError);
          return { data: null, error: updateError.message };
        }

        customerId = updatedCustomer!.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            full_name: bookingData.customer_name,
            email: bookingData.customer_email,
            phone: bookingData.customer_phone,
            address: bookingData.customer_address,
            city: bookingData.customer_city,
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating customer:', createError);
          return { data: null, error: createError.message };
        }

        customerId = newCustomer!.id;
      }

      // Step 2: Generate booking number
      const bookingNumber = `BK${Date.now()}`;

      // Step 3: Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_number: bookingNumber,
          customer_id: customerId,
          vehicle_id: bookingData.vehicle_id,
          pickup_date: bookingData.pickup_date,
          return_date: bookingData.return_date,
          pickup_location: bookingData.pickup_location,
          return_location: bookingData.return_location,
          total_days: bookingData.total_days,
          base_price: bookingData.base_price,
          extras_price: bookingData.extras_price || 0,
          discount_amount: bookingData.discount_amount || 0,
          total_price: bookingData.total_price,
          deposit_paid: bookingData.deposit_paid || 0,
          drive_option: bookingData.drive_option,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          payment_method: bookingData.payment_method,
          payment_receipt_url: bookingData.payment_receipt_url,
          location_cost: bookingData.location_cost || 0,
          driver_cost: bookingData.driver_cost || 0,
          pickup_delivery_location: bookingData.pickup_delivery_location,
          extras: bookingData.extras,
          status: 'pending',
        })
        .select(`
          *,
          customers:customer_id (id, full_name, email, phone, address, city, created_at, updated_at),
          vehicles:vehicle_id (brand, model, thumbnail, image_url)
        `)
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        return { data: null, error: bookingError.message };
      }

      return { data: booking as Booking, error: null };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return { data: null, error: error.message || 'Failed to create booking' };
    }
  },

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: Booking['status']): Promise<{ data: Booking | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          customers:customer_id (id, full_name, email, phone, address, city, created_at, updated_at),
          vehicles:vehicle_id (brand, model, thumbnail, image_url)
        `)
        .single();

      if (error) {
        console.error('Error updating booking status:', error);
        return { data: null, error: error.message };
      }

      return { data: data as Booking, error: null };
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      return { data: null, error: error.message || 'Failed to update booking status' };
    }
  },

  /**
   * Delete a booking
   */
  async delete(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting booking:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      return { error: error.message || 'Failed to delete booking' };
    }
  },
};

export default bookingService;
