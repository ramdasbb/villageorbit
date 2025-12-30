/**
 * RBAC Management API - Handles roles, permissions, and assignments
 * Endpoints: /rbac/roles, /rbac/permissions, assignments
 */

import { httpClient, ApiResponse } from './httpClient';

// Types
export interface Permission {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  permissions: string[];
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

/**
 * RBAC Management API methods
 */
export const rbacApi = {
  // ==================== PERMISSIONS ====================

  /**
   * Get all permissions
   * GET /rbac/permissions
   */
  getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    return httpClient.get<Permission[]>('/rbac/permissions');
  },

  /**
   * Create a new permission
   * POST /rbac/permissions
   */
  createPermission: async (data: CreatePermissionRequest): Promise<ApiResponse<Permission>> => {
    return httpClient.post<Permission>('/rbac/permissions', data);
  },

  /**
   * Delete a permission
   * DELETE /rbac/permissions/{permissionId}
   */
  deletePermission: async (permissionId: string): Promise<ApiResponse<null>> => {
    return httpClient.delete<null>(`/rbac/permissions/${permissionId}`);
  },

  // ==================== ROLES ====================

  /**
   * Get all roles
   * GET /rbac/roles
   */
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    return httpClient.get<Role[]>('/rbac/roles');
  },

  /**
   * Create a new role
   * POST /rbac/roles
   */
  createRole: async (data: CreateRoleRequest): Promise<ApiResponse<Role>> => {
    return httpClient.post<Role>('/rbac/roles', data);
  },

  /**
   * Delete a role
   * DELETE /rbac/roles/{roleId}
   */
  deleteRole: async (roleId: string): Promise<ApiResponse<null>> => {
    return httpClient.delete<null>(`/rbac/roles/${roleId}`);
  },

  /**
   * Assign permissions to a role
   * POST /rbac/roles/{roleId}/permissions
   */
  assignPermissionsToRole: async (roleId: string, permissionIds: string[]): Promise<ApiResponse<null>> => {
    return httpClient.post<null>(`/rbac/roles/${roleId}/permissions`, permissionIds);
  },

  // ==================== USER-ROLE ASSIGNMENTS ====================

  /**
   * Assign roles to a user
   * POST /rbac/users/{userId}/roles
   */
  assignRolesToUser: async (userId: string, roleIds: string[]): Promise<ApiResponse<null>> => {
    return httpClient.post<null>(`/rbac/users/${userId}/roles`, roleIds);
  },
};

export default rbacApi;
