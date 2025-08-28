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
 * Frontend authentication service with proper separation of concerns.
 * 
 * Implements clean architecture by separating authentication validation
 * from user profile management. Follows development principles:
 * - Single Responsibility Principle (SRP)
 * - Performance optimization with minimal API calls
 * - Type safety with centralized interfaces
 * 
 * @fileoverview Frontend auth service with future-proof architecture
 * @since 2025-01-28 - Updated to implement proper separation of concerns
 */
export const authService = {
  /**
   * Makes a login request to the backend.
   * 
   * @param {LoginPayload} credentials - The user's login credentials
   * @returns {Promise<AuthResponse>} Promise resolving with token and user data
   * 
   * @example
   * const result = await authService.login({ email: 'user@example.com', password: 'password123' });
   * console.log(`Logged in as ${result.user.firstName}`);
   */
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Makes a registration request to the backend.
   * 
   * @param {RegisterPayload} userData - The user's registration data
   * @returns {Promise<AuthResponse>} Promise resolving with token and user data
   * 
   * @example
   * const result = await authService.register({ 
   *   email: 'newuser@example.com', 
   *   password: 'password123',
   *   firstName: 'John',
   *   lastName: 'Doe'
   * });
   */
  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Validates current authentication token (fast, minimal data).
   * 
   * Uses /auth/me endpoint which only validates token and returns minimal
   * authentication status. Performance optimized for frequent calls.
   * 
   * Following SRP: Only handles authentication validation, not profile data.
   * 
   * @returns {Promise<boolean>} Promise resolving with authentication validity
   * 
   * @example
   * const isAuthenticated = await authService.validateToken();
   * if (isAuthenticated) {
   *   // User is authenticated, proceed with protected actions
   * }
   * 
   * @since 2025-01-28 - New method implementing proper separation of concerns
   */
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await api.get<any>('/auth/me');
      return response.data.success && response.data.tokenValid;
    } catch (error) {
      // Authentication failed - token is invalid or expired
      return false;
    }
  },

  /**
   * Fetches complete user profile data (separate concern from auth validation).
   * 
   * Uses /users/me endpoint for complete user profile including preferences,
   * detailed information, etc. Should be called after successful token validation.
   * 
   * Following SRP: Only handles user profile data, not authentication validation.
   * 
   * @returns {Promise<User>} Promise resolving with complete user profile
   * 
   * @example
   * // Proper usage: validate first, then load profile
   * const isValid = await authService.validateToken();
   * if (isValid) {
   *   const profile = await authService.getUserProfile();
   *   console.log(`Welcome ${profile.firstName}!`);
   * }
   * 
   * @since 2025-01-28 - Updated to use proper /users/me endpoint
   */
  getUserProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  /**
   * DEPRECATED: Legacy method for backward compatibility.
   * 
   * @deprecated Use validateToken() + getUserProfile() for better separation of concerns
   * @returns {Promise<User>} Promise resolving with user data from auth validation
   */
  getProfile: async (): Promise<User> => {
    console.warn('authService.getProfile() is deprecated. Use validateToken() + getUserProfile() instead.');
    
    const response = await api.get<any>('/auth/me');
    
    // Transform auth validation response to User interface (limited data)
    return {
      id: response.data.userId,
      email: response.data.email || '',
      firstName: '', // Not available in auth validation response
      lastName: '',  // Not available in auth validation response
      role: response.data.role || 'user'
    };
  },
};
