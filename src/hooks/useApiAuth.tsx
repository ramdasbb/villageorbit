/**
 * API-based Auth Hook
 * Replaces Supabase auth with REST API authentication
 */

import { useState, useEffect, useCallback } from "react";
import { authService, UserProfile, UserRole } from "@/services/authService";
import { tokenService } from "@/services/tokenService";

export interface UseApiAuthReturn {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isGramsevak: boolean;
  isSubAdmin: boolean;
  isApproved: boolean;
  permissions: string[];
  roles: UserRole[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    password: string;
    full_name: string;
    mobile: string;
    aadhar_number?: string;
  }) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useApiAuth = (): UseApiAuthReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for cached user first
        const cachedUser = authService.getCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
        }

        // If we have tokens, fetch fresh user data
        if (tokenService.hasTokens()) {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token invalid, clear everything
            tokenService.clearTokens();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        tokenService.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: {
    email: string;
    password: string;
    full_name: string;
    mobile: string;
    aadhar_number?: string;
  }) => {
    setLoading(true);
    try {
      const response = await authService.signup(data);
      
      if (response.success) {
        return { 
          success: true, 
          message: response.data?.message || 'Registration successful. Please wait for admin approval.' 
        };
      }
      
      return { success: false, error: response.error || 'Signup failed' };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!tokenService.hasTokens()) return;
    
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, []);

  const hasPermission = useCallback((permission: string) => {
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  const hasAnyPermission = useCallback((permissions: string[]) => {
    return permissions.some(p => user?.permissions?.includes(p));
  }, [user]);

  const hasRole = useCallback((role: string) => {
    if (!user?.roles) return false;
    return user.roles.some(r => 
      r.name.toLowerCase() === role.toLowerCase()
    );
  }, [user]);

  // Computed properties
  const isAuthenticated = !!user && tokenService.hasTokens();
  const isAdmin = hasRole('admin');
  const isSuperAdmin = hasRole('super_admin');
  const isGramsevak = hasRole('gramsevak');
  const isSubAdmin = hasRole('sub_admin');
  const isApproved = user?.approval_status === 'approved';
  const permissions = user?.permissions || [];
  const roles = user?.roles || [];

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isGramsevak,
    isSubAdmin,
    isApproved,
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasRole,
    login,
    signup,
    logout,
    refreshUser,
  };
};

export default useApiAuth;
