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
   * Fetches the current user's profile from the backend.
   * This is used to validate an existing token and get user details.
   * @returns A promise that resolves with the user's profile data.
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};
