import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../../constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token from storage:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Clear stored auth data
            await AsyncStorage.multiRemove([
              STORAGE_KEYS.USER_TOKEN,
              STORAGE_KEYS.USER_DATA,
            ]);

            // You might want to redirect to login screen here
            // This would typically be handled by your navigation logic
            console.log('User session expired, redirecting to login');
          } catch (storageError) {
            console.error('Error clearing storage:', storageError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete(url, config);
  }

  // Upload file method
  async uploadFile<T>(
    url: string,
    file: any,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  }

  // Download file method
  async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await this.api.get(url, {
        responseType: 'blob',
      });

      // Handle file download based on platform
      // This is a simplified version - you might need platform-specific implementations
      console.log('File downloaded:', filename);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  // Set base URL (useful for switching between environments)
  setBaseURL(baseURL: string) {
    this.api.defaults.baseURL = baseURL;
  }

  // Set auth token manually
  async setAuthToken(token: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Clear auth token
  async clearAuthToken() {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    delete this.api.defaults.headers.Authorization;
  }

  // Retry mechanism for failed requests
  async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    maxRetries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<AxiosResponse<T>> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on client errors (4xx) except 408, 429
        if (error.response?.status >= 400 && error.response?.status < 500) {
          if (error.response.status !== 408 && error.response.status !== 429) {
            throw error;
          }
        }

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

export const apiService = new ApiService();
