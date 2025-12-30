/**
 * Village Management API - Handles village operations
 * Endpoints: /villages
 */

import { httpClient, ApiResponse } from './httpClient';

// Types
export interface Village {
  id: string;
  name: string;
  slug: string;
  district: string;
  taluka?: string;
  state: string;
  pincode: string;
  isActive: boolean;
  createdAt: string;
}

export interface VillageConfig {
  id: string;
  villageId: string;
  language: string;
  villageName: string;
  sarpanchName?: string;
  gramsevakName?: string;
  contactNumber?: string;
  configData: Record<string, unknown>;
}

export interface CreateVillageRequest {
  name: string;
  slug: string;
  district: string;
  taluka?: string;
  state: string;
  pincode: string;
}

export interface UpdateVillageRequest {
  name?: string;
  district?: string;
  taluka?: string;
  state?: string;
  pincode?: string;
  isActive?: boolean;
}

/**
 * Village Management API methods
 */
export const villagesApi = {
  /**
   * List all villages (public)
   * GET /villages
   */
  getVillages: async (activeOnly: boolean = true): Promise<ApiResponse<Village[]>> => {
    const queryString = activeOnly ? '?activeOnly=true' : '';
    return httpClient.get<Village[]>(`/villages${queryString}`, { requiresAuth: false });
  },

  /**
   * Get village by ID (public)
   * GET /villages/{villageId}
   */
  getVillageById: async (villageId: string): Promise<ApiResponse<Village>> => {
    return httpClient.get<Village>(`/villages/${villageId}`, { requiresAuth: false });
  },

  /**
   * Get village configuration (public)
   * GET /villages/{villageId}/config
   */
  getVillageConfig: async (villageId: string, language: string = 'en'): Promise<ApiResponse<VillageConfig>> => {
    return httpClient.get<VillageConfig>(`/villages/${villageId}/config?language=${language}`, { requiresAuth: false });
  },

  /**
   * Create a new village (admin only)
   * POST /villages
   */
  createVillage: async (data: CreateVillageRequest): Promise<ApiResponse<Village>> => {
    return httpClient.post<Village>('/villages', data);
  },

  /**
   * Update a village (admin only)
   * PUT /villages/{villageId}
   */
  updateVillage: async (villageId: string, data: UpdateVillageRequest): Promise<ApiResponse<Village>> => {
    return httpClient.put<Village>(`/villages/${villageId}`, data);
  },

  /**
   * Delete a village (admin only)
   * DELETE /villages/{villageId}
   */
  deleteVillage: async (villageId: string): Promise<ApiResponse<null>> => {
    return httpClient.delete<null>(`/villages/${villageId}`);
  },
};

export default villagesApi;
