import apiClient from './authService';
import { User } from '../types/User';

/**
 * Fetches all users from the backend.
 * @returns A promise that resolves with an array of users.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users'); // Assuming an endpoint like /api/users
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users.');
  }
};
