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
  expires_in: number;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  mobile: string;
  aadhar_number?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  roles: UserRole[];
  permissions: string[];
  created_at: string;
  approved_at?: string;
  approved_by_user_id?: string | null;
}

export interface LoginResponseData extends AuthTokens {
  user: {
    user_id: string;
    email: string;
    full_name: string;
    roles: UserRole[];
    permissions: string[];
  };
}

export interface AuthError {
  code?: string;
  message: string;
}

// API wrapper response format
interface ApiWrapperResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string | null;
}

class AuthService {
  /**
   * Register a new user
   * On success, user must wait for admin approval
   */
  async signup(data: SignupRequest): Promise<ApiResponse<{ message: string; user_id?: string }>> {
    const response = await apiClient.post<ApiWrapperResponse<{ user_id: string; email: string; approval_status: string }>>(
      apiConfig.endpoints.auth.signup,
      data,
      false // No auth required for signup
    );

    if (response.success && response.data) {
      return {
        data: { message: response.data.message, user_id: response.data.data?.user_id },
        status: response.status,
        success: true,
      };
    }

    return {
      error: response.error || 'Signup failed',
      status: response.status,
      success: false,
    };
  }

  /**
   * Login user with email and password
   * Stores tokens on success
   */
  async login(data: LoginRequest): Promise<ApiResponse<{ user: UserProfile }>> {
    const response = await apiClient.post<ApiWrapperResponse<LoginResponseData>>(
      apiConfig.endpoints.auth.login,
      data,
      false // No auth required for login
    );

    if (response.success && response.data?.data) {
      const loginData = response.data.data;
      
      // Store tokens
      tokenService.setTokens(loginData.access_token, loginData.refresh_token);
      
      // Transform user data to UserProfile format
      const userProfile: UserProfile = {
        id: loginData.user.user_id,
        email: loginData.user.email,
        full_name: loginData.user.full_name,
        mobile: '',
        approval_status: 'approved',
        is_active: true,
        roles: loginData.user.roles,
        permissions: loginData.user.permissions,
        created_at: new Date().toISOString(),
      };
      
      // Store user data
      tokenService.setUserData(userProfile);

      return {
        data: { user: userProfile },
        status: response.status,
        success: true,
      };
    }

    // Check for USER_NOT_APPROVED error
    const errorCode = response.data?.error_code;
    if (errorCode === 'USER_NOT_APPROVED') {
      return {
        error: 'Your account is pending approval. Please wait for admin approval.',
        status: 403,
        success: false,
      };
    }

    return {
      error: response.data?.message || response.error || 'Login failed',
      status: response.status,
      success: false,
    };
  }

  /**
   * Logout user
   * Clears all tokens and user data
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenService.getRefreshToken();
      // Call logout endpoint (optional - may fail if token is already expired)
      await apiClient.post(apiConfig.endpoints.auth.logout, { refresh_token: refreshToken }, true);
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

    const response = await apiClient.get<ApiWrapperResponse<UserProfile>>(apiConfig.endpoints.auth.me);

    if (response.success && response.data?.data) {
      const userData = response.data.data;
      // Update stored user data
      tokenService.setUserData(userData);
      
      return {
        data: userData,
        status: response.status,
        success: true,
      };
    }

    return {
      error: response.error || 'Failed to fetch user profile',
      status: response.status,
      success: false,
    };
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
    if (!user?.roles) return false;
    return user.roles.some(r => 
      r.name.toLowerCase() === role.toLowerCase()
    );
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
    return this.hasRole('admin');
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  /**
   * Check if user is approved
   */
  isApproved(): boolean {
    const user = this.getCachedUser();
    return user?.approval_status === 'approved';
  }

  /**
   * Get role names from user
   */
  getRoleNames(): string[] {
    const user = this.getCachedUser();
    return user?.roles?.map(r => r.name) || [];
  }
}

export const authService = new AuthService();
export default authService;
