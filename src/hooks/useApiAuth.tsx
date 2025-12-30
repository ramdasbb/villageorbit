/**
 * API-based Auth Hook
 * Uses the new /src/api/ layer for authentication
 * Provides authentication state, user data, and auth methods
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { authApi, tokenService, UserData } from "@/api";
import { ROLES } from "@/lib/constants";

export interface UseApiAuthReturn {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isGramsevak: boolean;
  isSubAdmin: boolean;
  isApproved: boolean;
  permissions: string[];
  roles: Array<{ id: string; name: string }>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  mobile: string;
  aadharNumber?: string;
  villageId?: string;
}

// Pre-lowercase role names for faster comparison
const ROLE_ADMIN = ROLES.ADMIN.toLowerCase();
const ROLE_SUPER_ADMIN = ROLES.SUPER_ADMIN.toLowerCase();
const ROLE_GRAMSEVAK = ROLES.GRAMSEVAK.toLowerCase();
const ROLE_SUB_ADMIN = ROLES.SUB_ADMIN.toLowerCase();

export const useApiAuth = (): UseApiAuthReturn => {
  const [user, setUser] = useState<UserData | null>(() => {
    // Initialize from cache synchronously to prevent flash
    return tokenService.getUserData();
  });
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // If we have tokens, fetch fresh user data
        if (tokenService.hasTokens()) {
          const response = await authApi.getCurrentUser();
          if (mounted) {
            if (response.success && response.data) {
              setUser(response.data);
            } else {
              // Token invalid, clear everything
              tokenService.clearTokens();
              setUser(null);
            }
          }
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          tokenService.clearTokens();
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      
      const errorMessage = response.error?.message || 'Login failed';
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setLoading(true);
    try {
      const response = await authApi.signup({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        mobile: data.mobile,
        aadharNumber: data.aadharNumber,
        villageId: data.villageId || 'default',
      });
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message || 'Registration successful. Please wait for admin approval.' 
        };
      }
      
      const errorMessage = response.error?.message || 'Signup failed';
      return { success: false, error: errorMessage };
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
      await authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!tokenService.hasTokens()) return;
    
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, []);

  // Memoized role lookup set for O(1) access
  const roleNamesLower = useMemo(() => {
    if (!user?.roles) return new Set<string>();
    return new Set(user.roles.map(r => r.name?.toLowerCase() ?? ''));
  }, [user?.roles]);

  // Memoized permissions set for O(1) access
  const permissionsSet = useMemo(() => {
    return new Set(user?.allPermissions ?? []);
  }, [user?.allPermissions]);

  const hasPermission = useCallback((permission: string) => {
    return permissionsSet.has(permission);
  }, [permissionsSet]);

  const hasAnyPermission = useCallback((permissions: string[]) => {
    return permissions.some(p => permissionsSet.has(p));
  }, [permissionsSet]);

  const hasRole = useCallback((role: string) => {
    return roleNamesLower.has(role.toLowerCase());
  }, [roleNamesLower]);

  // Computed properties - memoized to prevent recalculation
  const computedValues = useMemo(() => ({
    isAuthenticated: !!user && tokenService.hasTokens(),
    isAdmin: roleNamesLower.has(ROLE_ADMIN),
    isSuperAdmin: roleNamesLower.has(ROLE_SUPER_ADMIN),
    isGramsevak: roleNamesLower.has(ROLE_GRAMSEVAK),
    isSubAdmin: roleNamesLower.has(ROLE_SUB_ADMIN),
    isApproved: user?.approvalStatus === 'APPROVED',
    permissions: user?.allPermissions ?? [],
    roles: user?.roles ?? [],
  }), [user, roleNamesLower]);

  return {
    user,
    loading,
    ...computedValues,
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
