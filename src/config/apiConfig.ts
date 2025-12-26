/**
 * API Configuration for Smart Village Backend
 * This file centralizes all API configuration settings
 * The API base URL is configurable via environment variables or admin config
 */

// Default API configuration
const DEFAULT_API_BASE_URL = 'https://core-api-tlw6.onrender.com';
const API_VERSION = 'v1';

// Get API base URL from environment or use default
export const getApiBaseUrl = (): string => {
  // Check environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check localStorage for admin-configured URL (future-ready)
  if (typeof window !== 'undefined') {
    const adminConfig = localStorage.getItem('admin_api_config');
    if (adminConfig) {
      try {
        const config = JSON.parse(adminConfig);
        if (config.apiBaseUrl) {
          return config.apiBaseUrl;
        }
      } catch (e) {
        console.warn('Failed to parse admin API config:', e);
      }
    }
  }
  
  return DEFAULT_API_BASE_URL;
};

// API Configuration object
export const apiConfig = {
  get baseUrl() {
    return getApiBaseUrl();
  },
  
  get apiUrl() {
    return `${this.baseUrl}/api/${API_VERSION}`;
  },
  
  // Endpoints
  endpoints: {
    // Health
    health: '/health',
    
    // Auth endpoints
    auth: {
      signup: '/auth/signup',
      login: '/auth/login',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh-token',
      me: '/auth/me',
    },
    
    // Admin endpoints
    admin: {
      users: '/admin/users',
      userById: (userId: string) => `/admin/users/${userId}`,
      approveUser: (userId: string) => `/admin/users/${userId}/approve`,
      rejectUser: (userId: string) => `/admin/users/${userId}/reject`,
    },
    
    // RBAC endpoints
    rbac: {
      permissions: '/rbac/permissions',
      permissionById: (permissionId: string) => `/rbac/permissions/${permissionId}`,
      roles: '/rbac/roles',
      roleById: (roleId: string) => `/rbac/roles/${roleId}`,
      rolePermissions: (roleId: string) => `/rbac/roles/${roleId}/permissions`,
      rolePermissionById: (roleId: string, permissionId: string) => 
        `/rbac/roles/${roleId}/permissions/${permissionId}`,
      userRoles: (userId: string) => `/rbac/users/${userId}/roles`,
      userRoleById: (userId: string, roleId: string) => 
        `/rbac/users/${userId}/roles/${roleId}`,
    },
  },
};

// Helper to update admin API config (for future admin panel)
export const updateApiConfig = (config: { apiBaseUrl?: string }) => {
  if (typeof window !== 'undefined') {
    const existingConfig = localStorage.getItem('admin_api_config');
    const parsed = existingConfig ? JSON.parse(existingConfig) : {};
    const newConfig = { ...parsed, ...config };
    localStorage.setItem('admin_api_config', JSON.stringify(newConfig));
  }
};

// Helper to reset API config to default
export const resetApiConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_api_config');
  }
};

export default apiConfig;
