/**
 * HTTP Client - Centralized API wrapper with automatic token handling
 * Handles all HTTP requests to the VillageOrbit backend
 */

import { tokenService } from './tokenService';

// API Base URL - configurable via environment variables
const getApiBaseUrl = (): string => {
  // Priority: Environment variable > Default production URL
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Default to production Render URL
  return 'https://core-api-tlw6.onrender.com/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
}

// Request options
interface RequestOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  villageId?: string;
}

// Token refresh state to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token
 */
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const result: ApiResponse<{ accessToken: string; expiresIn: number }> = await response.json();

    if (result.success && result.data?.accessToken) {
      tokenService.setAccessToken(result.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Handle token refresh with deduplication
 */
const handleTokenRefresh = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

/**
 * Build request headers
 */
const buildHeaders = (options: RequestOptions): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if required
  if (options.requiresAuth !== false) {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  // Add Village ID header if provided
  if (options.villageId) {
    headers['X-Village-Id'] = options.villageId;
  }

  return headers;
};

/**
 * Parse API response
 */
const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    return data as ApiResponse<T>;
  } catch {
    return {
      success: false,
      data: null,
      message: null,
      error: {
        code: 'PARSE_ERROR',
        message: 'Failed to parse response',
      },
    };
  }
};

/**
 * Make HTTP request with automatic retry on 401
 */
const request = async <T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = buildHeaders(options);

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET' && method !== 'DELETE') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(url, fetchOptions);

    // Handle 401 - attempt token refresh and retry once
    if (response.status === 401 && options.requiresAuth !== false) {
      const refreshed = await handleTokenRefresh();
      if (refreshed) {
        // Retry with new token
        const newHeaders = buildHeaders(options);
        response = await fetch(url, { ...fetchOptions, headers: newHeaders });
      } else {
        // Clear tokens and return unauthorized error
        tokenService.clearTokens();
        return {
          success: false,
          data: null,
          message: null,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Session expired. Please login again.',
          },
        };
      }
    }

    return parseResponse<T>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      data: null,
      message: null,
      error: {
        code: 'NETWORK_ERROR',
        message: errorMessage,
      },
    };
  }
};

/**
 * HTTP Client with typed methods
 */
export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('GET', endpoint, undefined, options),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', endpoint, body, options),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', endpoint, body, options),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', endpoint, body, options),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('DELETE', endpoint, undefined, options),
};

export default httpClient;
