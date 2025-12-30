/**
 * Token Service - Handles secure storage and retrieval of auth tokens
 * Single source of truth for authentication state
 */

const ACCESS_TOKEN_KEY = 'vo_access_token';
const REFRESH_TOKEN_KEY = 'vo_refresh_token';
const USER_DATA_KEY = 'vo_user_data';

export interface UserData {
  userId: string;
  email: string;
  fullName: string;
  mobile?: string;
  aadharNumber?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  villageId?: string;
  isActive?: boolean;
  roles: Array<{ id: string; name: string; permissions?: Array<{ id: string; name: string }> }>;
  allPermissions?: string[];
  createdAt: string;
}

class TokenService {
  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Store both tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Set only access token (for token refresh)
   */
  setAccessToken(accessToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  /**
   * Clear all tokens and user data
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  /**
   * Check if tokens exist
   */
  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  /**
   * Check if user is authenticated (has valid access token)
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Store user data
   */
  setUserData(userData: UserData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  /**
   * Get stored user data
   */
  getUserData(): UserData | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Parse JWT token to get payload
   */
  parseToken(token: string): Record<string, unknown> | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Check if access token is expired or about to expire (within 60 seconds)
   */
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const payload = this.parseToken(token);
    if (!payload || typeof payload.exp !== 'number') return true;

    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime - 60000;
  }
}

export const tokenService = new TokenService();
export default tokenService;
