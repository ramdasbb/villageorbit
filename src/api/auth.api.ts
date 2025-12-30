/**
 * Authentication API - Handles all auth-related API calls
 * Endpoints: signup, login, refresh-token, logout, me
 */

import { httpClient, ApiResponse } from './httpClient';
import { tokenService, UserData } from './tokenService';

// Request types
export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  mobile?: string;
  aadharNumber?: string;
  villageId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Response types
export interface SignupResponse {
  userId: string;
  email: string;
  fullName: string;
  mobile?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  villageId: string;
  isActive: boolean;
  roles: Array<{ id: string; name: string }>;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserData;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Register a new user
   * POST /auth/signup
   */
  signup: async (data: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
    return httpClient.post<SignupResponse>('/auth/signup', data, { requiresAuth: false });
  },

  /**
   * Login user and receive tokens
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data, { requiresAuth: false });
    
    if (response.success && response.data) {
      // Store tokens and user data
      tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
      tokenService.setUserData(response.data.user);
    }
    
    return response;
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      return {
        success: false,
        data: null,
        message: null,
        error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token available' },
      };
    }

    const response = await httpClient.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      { refreshToken },
      { requiresAuth: false }
    );

    if (response.success && response.data) {
      tokenService.setAccessToken(response.data.accessToken);
    }

    return response;
  },

  /**
   * Logout user and revoke tokens
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    const refreshToken = tokenService.getRefreshToken();
    if (refreshToken) {
      await httpClient.post('/auth/logout', { refreshToken });
    }
    tokenService.clearTokens();
  },

  /**
   * Get current user profile
   * GET /auth/me
   */
  getCurrentUser: async (): Promise<ApiResponse<UserData>> => {
    const response = await httpClient.get<UserData>('/auth/me');
    
    if (response.success && response.data) {
      tokenService.setUserData(response.data);
    }
    
    return response;
  },

  /**
   * Request password reset email
   * POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    return httpClient.post<null>('/auth/forgot-password', data, { requiresAuth: false });
  },

  /**
   * Validate password reset token
   * GET /auth/validate-reset-token?token=...
   */
  validateResetToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    return httpClient.get<{ valid: boolean }>(`/auth/validate-reset-token?token=${token}`, { requiresAuth: false });
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    return httpClient.post<null>('/auth/reset-password', data, { requiresAuth: false });
  },
};

export default authApi;
