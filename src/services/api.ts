import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { config } from '@utils/config';

/**
 * Base API client configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (requestConfig) => {
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }

      if (config.features.debugMode) {
        // eslint-disable-next-line no-console
        console.log(`[API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (config.features.debugMode) {
        // eslint-disable-next-line no-console
        console.log(`[API Response] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    (error) => {
      if (config.features.debugMode) {
        console.error('[API Error]', error.response?.data || error.message);
      }

      // Handle common errors
      if (error.response?.status === 401) {
        // Handle unauthorized - clear token and redirect
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * Generic API request wrapper
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

/**
 * GET request helper
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'GET', url });
}

/**
 * POST request helper
 */
export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest<T>({ ...config, method: 'POST', url, data });
}

/**
 * PUT request helper
 */
export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'PUT', url, data });
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest<T>({ ...config, method: 'PATCH', url, data });
}

/**
 * DELETE request helper
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'DELETE', url });
}

export default apiClient;
