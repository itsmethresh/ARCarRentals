import { get, post, put } from './api';
import type { Booking, ApiResponse, PaginatedResponse } from '@/types';

/**
 * Booking service for managing booking-related API calls
 */
export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<ApiResponse<Booking>> {
    return post<ApiResponse<Booking>>('/bookings', bookingData);
  },

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return get<ApiResponse<Booking>>(`/bookings/${id}`);
  },

  /**
   * Get user's bookings
   */
  async getUserBookings(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Booking>> {
    return get<PaginatedResponse<Booking>>(
      `/bookings/user/${userId}?page=${page}&pageSize=${pageSize}`
    );
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return put<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(
    id: string,
    status: Booking['status']
  ): Promise<ApiResponse<Booking>> {
    return put<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
  },

  /**
   * Calculate booking price
   */
  async calculatePrice(
    carId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{ totalDays: number; totalPrice: number }>> {
    return post<ApiResponse<{ totalDays: number; totalPrice: number }>>('/bookings/calculate', {
      carId,
      startDate,
      endDate,
    });
  },
};

export default bookingService;
