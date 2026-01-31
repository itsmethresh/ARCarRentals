import { get, post } from './api';
import type { Car, SearchParams, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Car service for managing car-related API calls
 */
export const carService = {
  /**
   * Get all available cars
   */
  async getAllCars(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Car>> {
    return get<PaginatedResponse<Car>>(`/cars?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Get car by ID
   */
  async getCarById(id: string): Promise<ApiResponse<Car>> {
    return get<ApiResponse<Car>>(`/cars/${id}`);
  },

  /**
   * Search cars based on criteria
   */
  async searchCars(params: SearchParams): Promise<PaginatedResponse<Car>> {
    const queryParams = new URLSearchParams();

    if (params.pickupLocation) {
      queryParams.append('location', params.pickupLocation);
    }
    if (params.pickupDate) {
      queryParams.append('date', params.pickupDate);
    }
    if (params.carType) {
      queryParams.append('type', params.carType);
    }

    return get<PaginatedResponse<Car>>(`/cars/search?${queryParams.toString()}`);
  },

  /**
   * Get featured cars for homepage
   */
  async getFeaturedCars(): Promise<ApiResponse<Car[]>> {
    return get<ApiResponse<Car[]>>('/cars/featured');
  },

  /**
   * Get cars by category
   */
  async getCarsByCategory(category: string): Promise<PaginatedResponse<Car>> {
    return get<PaginatedResponse<Car>>(`/cars/category/${category}`);
  },

  /**
   * Check car availability
   */
  async checkAvailability(
    carId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<boolean>> {
    return post<ApiResponse<boolean>>(`/cars/${carId}/availability`, {
      startDate,
      endDate,
    });
  },
};

export default carService;
