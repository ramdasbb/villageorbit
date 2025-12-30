/**
 * API Module - Centralized exports for all API services
 * This is the main entry point for all API calls
 */

// Core
export { httpClient, API_BASE_URL } from './httpClient';
export type { ApiResponse, ApiError } from './httpClient';

// Token Service
export { tokenService } from './tokenService';
export type { UserData } from './tokenService';

// Authentication
export { authApi } from './auth.api';
export type {
  SignupRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignupResponse,
  LoginResponse,
  RefreshTokenResponse,
} from './auth.api';

// User Profile
export { userProfileApi } from './userProfile.api';
export type { UpdateProfileRequest, ProfileResponse } from './userProfile.api';

// Admin User Management
export { adminUsersApi } from './adminUsers.api';
export type {
  AdminUser,
  PaginatedUsers,
  UserListParams,
  ApproveUserRequest,
  RejectUserRequest,
} from './adminUsers.api';

// RBAC Management
export { rbacApi } from './rbac.api';
export type {
  Permission,
  Role,
  CreatePermissionRequest,
  CreateRoleRequest,
} from './rbac.api';

// Village Management
export { villagesApi } from './villages.api';
export type {
  Village,
  VillageConfig,
  CreateVillageRequest,
  UpdateVillageRequest,
} from './villages.api';
