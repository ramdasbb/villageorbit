/**
 * Admin User Management API - Handles admin user operations
 * Endpoints: GET/POST/DELETE /admin/users
 */

import { httpClient, ApiResponse } from './httpClient';

// Types
export interface AdminUser {
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

export interface PaginatedUsers {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UserListParams {
  villageId?: string;
  page?: number;
  size?: number;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  search?: string;
}

export interface ApproveUserRequest {
  villageId: string;
}

export interface RejectUserRequest {
  villageId: string;
  reason?: string;
}

/**
 * Build query string from params
 */
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Admin User Management API methods
 */
export const adminUsersApi = {
  /**
   * Get paginated list of users
   * GET /admin/users
   */
  getUsers: async (params: UserListParams = {}): Promise<ApiResponse<PaginatedUsers>> => {
    const queryString = buildQueryString({
      villageId: params.villageId,
      page: params.page ?? 0,
      size: params.size ?? 20,
      approvalStatus: params.approvalStatus,
      search: params.search,
    });
    return httpClient.get<PaginatedUsers>(`/admin/users${queryString}`);
  },

  /**
   * Get user by ID
   * GET /admin/users/{userId}
   */
  getUserById: async (userId: string, villageId?: string): Promise<ApiResponse<AdminUser>> => {
    const queryString = villageId ? `?villageId=${villageId}` : '';
    return httpClient.get<AdminUser>(`/admin/users/${userId}${queryString}`);
  },

  /**
   * Approve a user
   * POST /admin/users/{userId}/approve
   */
  approveUser: async (userId: string, data: ApproveUserRequest): Promise<ApiResponse<null>> => {
    return httpClient.post<null>(`/admin/users/${userId}/approve`, data);
  },

  /**
   * Reject a user
   * POST /admin/users/{userId}/reject
   */
  rejectUser: async (userId: string, data: RejectUserRequest): Promise<ApiResponse<null>> => {
    return httpClient.post<null>(`/admin/users/${userId}/reject`, data);
  },

  /**
   * Delete a user
   * DELETE /admin/users/{userId}
   */
  deleteUser: async (userId: string, villageId?: string): Promise<ApiResponse<null>> => {
    const queryString = villageId ? `?villageId=${villageId}` : '';
    return httpClient.delete<null>(`/admin/users/${userId}${queryString}`);
  },
};

export default adminUsersApi;
