import api from './api';
import { User } from '../types/User';

// Define types for request payloads and responses
interface LoginPayload {
  email: string;
  password?: string;
}

interface RegisterPayload {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * The authService object encapsulates all authentication-related API calls.
 * It uses the centralized 'api' service, which handles token injection
 * and global error handling (like 401s).
 */
export const authService = {
  /**
   * Makes a login request to the backend.
   * @param credentials - The user's login credentials.
   * @returns A promise that resolves with the token and user data.
   */
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Makes a registration request to the backend.
   * @param userData - The user's registration data.
   * @returns A promise that resolves with the token and user data.
   */
  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Validates the current authentication token and returns basic user information.
   * 
   * This method calls /auth/me which is optimized for authentication validation.
   * It does NOT return full user profile data - use a separate getUserProfile method for that.
   * 
   * @returns A promise that resolves with basic user authentication data
   * @since 2025-01-28 - Updated to use /auth/me for authentication validation (resolves 404 errors)
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<any>('/auth/me');
    
    // Transform the auth validation response to match User interface expected by AuthContext
    return {
      id: response.data.userId,
      email: response.data.email || '',
      firstName: response.data.firstName || '',
      lastName: response.data.lastName || '',
      role: response.data.role || 'user'
    };
  },

  /**
   * Fetches the complete user profile from the backend.
   * This should be used when full user profile data is needed (preferences, detailed info, etc.).
   * @returns A promise that resolves with complete user profile data
   */
  getUserProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};
