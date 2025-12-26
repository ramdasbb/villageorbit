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
}

class RbacService {
  // ============ PERMISSIONS ============

  /**
   * Get all permissions
   */
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    return apiClient.get<Permission[]>(apiConfig.endpoints.rbac.permissions);
  }

  /**
   * Create a new permission
   */
  async createPermission(data: CreatePermissionRequest): Promise<ApiResponse<Permission>> {
    return apiClient.post<Permission>(apiConfig.endpoints.rbac.permissions, data);
  }

  /**
   * Delete a permission
   */
  async deletePermission(permissionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(
      apiConfig.endpoints.rbac.permissionById(permissionId)
    );
  }

  // ============ ROLES ============

  /**
   * Get all roles
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return apiClient.get<Role[]>(apiConfig.endpoints.rbac.roles);
  }

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return apiClient.post<Role>(apiConfig.endpoints.rbac.roles, data);
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(apiConfig.endpoints.rbac.roleById(roleId));
  }

  // ============ ROLE-PERMISSION MAPPING ============

  /**
   * Add permission to a role
   */
  async addPermissionToRole(
    roleId: string,
    permissionId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      apiConfig.endpoints.rbac.rolePermissions(roleId),
      { permission_id: permissionId }
    );
  }

  /**
   * Remove permission from a role
   */
  async removePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(
      apiConfig.endpoints.rbac.rolePermissionById(roleId, permissionId)
    );
  }

  // ============ USER-ROLE MAPPING ============

  /**
   * Assign role to a user
   */
  async assignRoleToUser(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      apiConfig.endpoints.rbac.userRoles(userId),
      { role_id: roleId }
    );
  }

  /**
   * Remove role from a user
   */
  async removeRoleFromUser(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(
      apiConfig.endpoints.rbac.userRoleById(userId, roleId)
    );
  }
}

export const rbacService = new RbacService();
export default rbacService;
