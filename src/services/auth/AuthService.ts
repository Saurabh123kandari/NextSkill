import { User, ApiResponse } from '../../types';
import { API_CONFIG } from '../../constants';
import { apiService } from '../api/ApiService';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  private baseUrl = `${API_CONFIG.BASE_URL}/auth`;

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<ApiResponse<LoginResponse>>(
        `${this.baseUrl}/login`,
        { email, password }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      const response = await apiService.post<ApiResponse<LoginResponse>>(
        `${this.baseUrl}/register`,
        userData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/logout`);
    } catch (error) {
      // Logout should not fail the app even if server call fails
      console.warn('Logout API call failed:', error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await apiService.post<ApiResponse<void>>(
        `${this.baseUrl}/forgot-password`,
        { email }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password reset failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Password reset failed');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const response = await apiService.post<ApiResponse<void>>(
        `${this.baseUrl}/reset-password`,
        { token, password }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password reset failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Password reset failed');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<ApiResponse<User>>(
        `${this.baseUrl}/profile`,
        userData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Profile update failed');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Profile update failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.put<ApiResponse<void>>(
        `${this.baseUrl}/change-password`,
        { currentPassword, newPassword }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Password change failed');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const response = await apiService.delete<ApiResponse<void>>(
        `${this.baseUrl}/account`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Account deletion failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Account deletion failed');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiService.post<ApiResponse<void>>(
        `${this.baseUrl}/verify-email`,
        { token }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Email verification failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Email verification failed');
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      const response = await apiService.post<ApiResponse<void>>(
        `${this.baseUrl}/resend-verification`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to resend verification email');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to resend verification email');
    }
  }
}

export const authService = new AuthService();
