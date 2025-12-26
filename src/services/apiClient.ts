/**
 * Centralized API Client
 * Handles all HTTP requests with token management and error handling
 */

import { apiConfig } from '@/config/apiConfig';
import { tokenService } from './tokenService';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${apiConfig.apiUrl}${apiConfig.endpoints.auth.refreshToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        tokenService.clearTokens();
        return null;
      }

      const data = await response.json();
      tokenService.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenService.clearTokens();
      return null;
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = tokenService.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${apiConfig.apiUrl}${endpoint}`;
    
    try {
      const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle 401 - Attempt token refresh
      if (response.status === 401 && requiresAuth) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            // Retry the original request
            return this.request<T>(endpoint, options, requiresAuth);
          } else {
            // Refresh failed, clear tokens and return error
            return {
              error: 'Session expired. Please login again.',
              status: 401,
              success: false,
            };
          }
        } else {
          // Wait for the refresh to complete
          return new Promise((resolve) => {
            this.subscribeTokenRefresh(async () => {
              resolve(await this.request<T>(endpoint, options, requiresAuth));
            });
          });
        }
      }

      const data = response.ok ? await response.json().catch(() => null) : null;
      const errorData = !response.ok ? await response.json().catch(() => ({ message: 'Request failed' })) : null;

      return {
        data,
        error: errorData?.message || errorData?.error,
        status: response.status,
        success: response.ok,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
        success: false,
      };
    }
  }

  async get<T = any>(endpoint: string, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, requiresAuth);
  }

  async post<T = any>(endpoint: string, body: any, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      requiresAuth
    );
  }

  async put<T = any>(endpoint: string, body: any, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      requiresAuth
    );
  }

  async delete<T = any>(endpoint: string, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requiresAuth);
  }

  // Health check - no auth required
  async healthCheck(): Promise<ApiResponse<{ status: string; message?: string }>> {
    return this.get(apiConfig.endpoints.health, false);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
