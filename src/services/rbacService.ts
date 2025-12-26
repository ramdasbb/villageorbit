/**
 * RBAC Service
 * Handles Role-Based Access Control API calls
 * Only accessible by SUPER_ADMIN users
 */

import { apiClient, ApiResponse } from './apiClient';
import { apiConfig } from '@/config/apiConfig';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system_role: boolean;
  permissions: Permission[];
  created_at: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  is_system_role?: boolean;
}

// API wrapper response format
interface ApiWrapperResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string | null;
}

class RbacService {
  // ============ PERMISSIONS ============

  /**
   * Get all permissions
   */
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await apiClient.get<ApiWrapperResponse<Permission[]>>(apiConfig.endpoints.rbac.permissions);
    
    if (response.success && response.data?.data) {
      return {
        data: response.data.data,
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.error || 'Failed to fetch permissions',
      status: response.status,
      success: false,
    };
  }

  /**
   * Create a new permission
   */
  async createPermission(data: CreatePermissionRequest): Promise<ApiResponse<Permission>> {
    const response = await apiClient.post<ApiWrapperResponse<Permission>>(apiConfig.endpoints.rbac.permissions, data);
    
    if (response.success && response.data?.data) {
      return {
        data: response.data.data,
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.data?.message || response.error || 'Failed to create permission',
      status: response.status,
      success: false,
    };
  }

  /**
   * Delete a permission
   */
  async deletePermission(permissionId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<ApiWrapperResponse<null>>(
      apiConfig.endpoints.rbac.permissionById(permissionId)
    );
    
    return {
      data: { message: response.data?.message || 'Permission deleted' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }

  // ============ ROLES ============

  /**
   * Get all roles
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await apiClient.get<ApiWrapperResponse<Role[]>>(apiConfig.endpoints.rbac.roles);
    
    if (response.success && response.data?.data) {
      return {
        data: response.data.data,
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.error || 'Failed to fetch roles',
      status: response.status,
      success: false,
    };
  }

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    const response = await apiClient.post<ApiWrapperResponse<Role>>(apiConfig.endpoints.rbac.roles, data);
    
    if (response.success && response.data?.data) {
      return {
        data: response.data.data,
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.data?.message || response.error || 'Failed to create role',
      status: response.status,
      success: false,
    };
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<ApiWrapperResponse<null>>(apiConfig.endpoints.rbac.roleById(roleId));
    
    return {
      data: { message: response.data?.message || 'Role deleted' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }

  // ============ ROLE-PERMISSION MAPPING ============

  /**
   * Add permissions to a role
   */
  async addPermissionsToRole(
    roleId: string,
    permissionIds: string[]
  ): Promise<ApiResponse<Role>> {
    const response = await apiClient.post<ApiWrapperResponse<Role>>(
      apiConfig.endpoints.rbac.rolePermissions(roleId),
      { permission_ids: permissionIds }
    );
    
    if (response.success && response.data?.data) {
      return {
        data: response.data.data,
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.data?.message || response.error || 'Failed to assign permissions',
      status: response.status,
      success: false,
    };
  }

  /**
   * Remove permission from a role
   */
  async removePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<ApiWrapperResponse<null>>(
      apiConfig.endpoints.rbac.rolePermissionById(roleId, permissionId)
    );
    
    return {
      data: { message: response.data?.message || 'Permission removed from role' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }

  // ============ USER-ROLE MAPPING ============

  /**
   * Assign roles to a user
   */
  async assignRolesToUser(
    userId: string,
    roleIds: string[]
  ): Promise<ApiResponse<{ user_id: string; roles: { id: string; name: string }[] }>> {
    const response = await apiClient.post<ApiWrapperResponse<{ user_id: string; email: string; roles: { id: string; name: string }[]; all_permissions: string[] }>>(
      apiConfig.endpoints.rbac.userRoles(userId),
      { role_ids: roleIds }
    );
    
    if (response.success && response.data?.data) {
      return {
        data: {
          user_id: response.data.data.user_id,
          roles: response.data.data.roles,
        },
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.data?.message || response.error || 'Failed to assign roles',
      status: response.status,
      success: false,
    };
  }

  /**
   * Remove role from a user
   */
  async removeRoleFromUser(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<ApiWrapperResponse<null>>(
      apiConfig.endpoints.rbac.userRoleById(userId, roleId)
    );
    
    return {
      data: { message: response.data?.message || 'Role removed from user' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }
}

export const rbacService = new RbacService();
export default rbacService;
