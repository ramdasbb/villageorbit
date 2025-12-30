/**
 * User Profile API - Handles user profile operations
 * Endpoints: GET/PUT /users/profile
 */

import { httpClient, ApiResponse } from './httpClient';
import { tokenService, UserData } from './tokenService';

// Request types
export interface UpdateProfileRequest {
  fullName?: string;
  mobile?: string;
  aadharNumber?: string;
}

// Response types
export interface ProfileResponse {
  userId: string;
  email: string;
  fullName: string;
  mobile?: string;
  aadharNumber?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  villageId?: string;
  roles: Array<{ id: string; name: string }>;
  allPermissions: string[];
  createdAt: string;
}

/**
 * User Profile API methods
 */
export const userProfileApi = {
  /**
   * Get current user's profile
   * GET /users/profile
   */
  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    const response = await httpClient.get<ProfileResponse>('/users/profile');
    
    if (response.success && response.data) {
      // Update cached user data
      const userData: UserData = {
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName,
        mobile: response.data.mobile,
        aadharNumber: response.data.aadharNumber,
        approvalStatus: response.data.approvalStatus,
        villageId: response.data.villageId,
        roles: response.data.roles,
        allPermissions: response.data.allPermissions,
        createdAt: response.data.createdAt,
      };
      tokenService.setUserData(userData);
    }
    
    return response;
  },

  /**
   * Update current user's profile
   * PUT /users/profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> => {
    const response = await httpClient.put<ProfileResponse>('/users/profile', data);
    
    if (response.success && response.data) {
      // Update cached user data
      const currentUser = tokenService.getUserData();
      if (currentUser) {
        const updatedUser: UserData = {
          ...currentUser,
          fullName: response.data.fullName || currentUser.fullName,
          mobile: response.data.mobile || currentUser.mobile,
          aadharNumber: response.data.aadharNumber || currentUser.aadharNumber,
        };
        tokenService.setUserData(updatedUser);
      }
    }
    
    return response;
  },
};

export default userProfileApi;
