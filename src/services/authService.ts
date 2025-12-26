/**
 * Authentication Service
 * Handles all auth-related API calls
 */

import { apiClient, ApiResponse } from './apiClient';
import { tokenService } from './tokenService';
import { apiConfig } from '@/config/apiConfig';

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
  mobile: string;
  aadhar_number?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  mobile: string;
  aadhar_number?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at?: string;
}

export interface LoginResponse extends AuthTokens {
  user: UserProfile;
}

export interface AuthError {
  code?: string;
  message: string;
}

class AuthService {
  /**
   * Register a new user
   * On success, user must wait for admin approval
   */
  async signup(data: SignupRequest): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>(
      apiConfig.endpoints.auth.signup,
      data,
      false // No auth required for signup
    );

    return response;
  }

  /**
   * Login user with email and password
   * Stores tokens on success
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(
      apiConfig.endpoints.auth.login,
      data,
      false // No auth required for login
    );

    if (response.success && response.data) {
      // Store tokens
      tokenService.setTokens(response.data.access_token, response.data.refresh_token);
      // Store user data
      tokenService.setUserData(response.data.user);
    }

    return response;
  }

  /**
   * Logout user
   * Clears all tokens and user data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - may fail if token is already expired)
      await apiClient.post(apiConfig.endpoints.auth.logout, {}, true);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear tokens locally
      tokenService.clearTokens();
    }
  }

  /**
   * Get current user profile
   * Returns null if not authenticated
   */
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    // First check if we have tokens
    if (!tokenService.hasTokens()) {
      return {
        error: 'Not authenticated',
        status: 401,
        success: false,
      };
    }

    const response = await apiClient.get<UserProfile>(apiConfig.endpoints.auth.me);

    if (response.success && response.data) {
      // Update stored user data
      tokenService.setUserData(response.data);
    }

    return response;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenService.hasTokens() && !tokenService.isTokenExpired();
  }

  /**
   * Get cached user data (without API call)
   */
  getCachedUser(): UserProfile | null {
    return tokenService.getUserData();
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCachedUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCachedUser();
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('admin');
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN') || this.hasRole('super_admin');
  }

  /**
   * Check if user is approved
   */
  isApproved(): boolean {
    const user = this.getCachedUser();
    return user?.approval_status === 'approved';
  }
}

export const authService = new AuthService();
export default authService;
