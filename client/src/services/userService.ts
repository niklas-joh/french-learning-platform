/**
 * Service layer for user related API calls.
 */
import apiClient from './authService';
import { User } from '../types/User';
import { UserOverallProgress } from '../types/Progress';
import { UserPreferences } from '../types/Preference';

/**
 * Fetches all users from the backend.
 * @returns A promise that resolves with an array of users.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users.');
  }
};
// TODO: memoize user list to reduce network calls

export const getUserProgress = async (): Promise<UserOverallProgress> => {
  try {
    // The user ID will be extracted from the token on the backend.
    const response = await apiClient.get<UserOverallProgress>('/users/me/progress');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user progress:', error);
    throw new Error('Failed to fetch user progress.');
  }
};

export const getUserPreferences = async (): Promise<UserPreferences> => {
    try {
        const response = await apiClient.get<UserPreferences>('/users/me/preferences');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user preferences:', error);
        throw new Error('Failed to fetch user preferences.');
    }
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<UserPreferences> => {
    try {
        const response = await apiClient.put<UserPreferences>('/users/me/preferences', { preferences });
        return response.data;
    } catch (error) {
        console.error('Failed to save user preferences:', error);
        throw new Error('Failed to save user preferences.');
    }
};

export const recordContentCompletion = async (contentId: number): Promise<void> => {
  try {
    await apiClient.post(`/users/me/progress/content/${contentId}`);
  } catch (error) {
    console.error('Failed to record content completion:', error);
    // We can choose to throw or not, depending on whether the UI needs to react to this failure.
    // For now, we log the error but don't throw, so the UI doesn't show a breaking error.
  }
};
