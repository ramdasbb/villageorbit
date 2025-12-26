/**
 * Admin Service
 * Handles admin-related API calls for user management
 */

import { apiClient, ApiResponse } from './apiClient';
import { apiConfig } from '@/config/apiConfig';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  mobile: string;
  aadhar_number?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  roles: string[];
  created_at: string;
  updated_at?: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  approval_status?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

// API wrapper response format
interface ApiWrapperResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string | null;
}

// Backend response format for users list
interface BackendUsersResponse {
  users: Array<{
    user_id?: string;
    id?: string;
    email: string;
    full_name: string;
    mobile?: string;
    approval_status: string;
    roles?: Array<{ id: string; name: string }>;
    created_at: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

class AdminService {
  /**
   * Get paginated list of users
   */
  async getUsers(params: UserListParams = {}): Promise<ApiResponse<PaginatedUsers>> {
    const queryParams = new URLSearchParams();
    
    // Page is 0-indexed on the backend
    queryParams.append('page', (params.page ?? 0).toString());
    queryParams.append('limit', (params.limit ?? 20).toString());
    if (params.approval_status) queryParams.append('approval_status', params.approval_status);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `${apiConfig.endpoints.admin.users}?${queryString}`;

    const response = await apiClient.get<ApiWrapperResponse<BackendUsersResponse>>(endpoint);

    if (response.success && response.data?.data) {
      const backendData = response.data.data;
      // Transform backend response to expected format
      const users: AdminUser[] = backendData.users.map(u => ({
        id: u.user_id || u.id || '',
        email: u.email,
        full_name: u.full_name,
        mobile: u.mobile || '',
        approval_status: u.approval_status as 'pending' | 'approved' | 'rejected',
        roles: u.roles ? u.roles.map(r => r.name) : [],
        created_at: u.created_at,
      }));

      return {
        data: {
          users,
          total: backendData.total,
          page: backendData.page,
          limit: backendData.limit,
          totalPages: Math.ceil(backendData.total / backendData.limit),
        },
        status: response.status,
        success: true,
      };
    }
    
    return {
      error: response.error || 'Failed to fetch users',
      status: response.status,
      success: false,
    };
  }

  /**
   * Get user details by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    const response = await apiClient.get<ApiWrapperResponse<any>>(
      apiConfig.endpoints.admin.userById(userId)
    );

    if (response.success && response.data?.data) {
      const u = response.data.data;
      return {
        data: {
          id: u.user_id || u.id,
          email: u.email,
          full_name: u.full_name,
          mobile: u.mobile || '',
          aadhar_number: u.aadhar_number,
          approval_status: u.approval_status,
          rejection_reason: u.rejection_reason,
          roles: u.roles ? u.roles.map((r: any) => r.name) : [],
          created_at: u.created_at,
        },
        status: response.status,
        success: true,
      };
    }

    return {
      error: response.error || 'Failed to fetch user',
      status: response.status,
      success: false,
    };
  }

  /**
   * Approve a user (GET request as per API spec)
   */
  async approveUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.get<ApiWrapperResponse<any>>(
      apiConfig.endpoints.admin.approveUser(userId)
    );

    return {
      data: { message: response.data?.message || 'User approved' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }

  /**
   * Reject a user with reason (GET request with query param as per API spec)
   */
  async rejectUser(userId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    const encodedReason = encodeURIComponent(reason);
    const response = await apiClient.get<ApiWrapperResponse<any>>(
      `${apiConfig.endpoints.admin.rejectUser(userId)}?reason=${encodedReason}`
    );

    return {
      data: { message: response.data?.message || 'User rejected' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }

  /**
   * Delete (soft delete) a user
   */
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<ApiWrapperResponse<any>>(
      apiConfig.endpoints.admin.userById(userId)
    );

    return {
      data: { message: response.data?.message || 'User deleted' },
      status: response.status,
      success: response.success,
      error: response.error,
    };
  }
}

export const adminService = new AdminService();
export default adminService;
