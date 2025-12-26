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
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

class AdminService {
  /**
   * Get paginated list of users
   */
  async getUsers(params: UserListParams = {}): Promise<ApiResponse<PaginatedUsers>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${apiConfig.endpoints.admin.users}?${queryString}` 
      : apiConfig.endpoints.admin.users;

    return apiClient.get<PaginatedUsers>(endpoint);
  }

  /**
   * Get user details by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<AdminUser>(apiConfig.endpoints.admin.userById(userId));
  }

  /**
   * Approve a user
   */
  async approveUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      apiConfig.endpoints.admin.approveUser(userId),
      {}
    );
  }

  /**
   * Reject a user with reason
   */
  async rejectUser(userId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      apiConfig.endpoints.admin.rejectUser(userId),
      { reason }
    );
  }

  /**
   * Delete (soft delete) a user
   */
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(apiConfig.endpoints.admin.userById(userId));
  }
}

export const adminService = new AdminService();
export default adminService;
