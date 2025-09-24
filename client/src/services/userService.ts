/**
 * Service layer for user related API calls.
 */
import api from './api';
import { User } from '../types/User';
import { UserOverallProgress } from '../types/Progress';
import { UserPreferences } from '../types/Preference';

/**
 * Fetches all users from the backend.
 * @returns A promise that resolves with an array of users.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users.');
  }
};
// TODO: memoize user list to reduce network calls

/**
 * Fetches the current authenticated user's profile.
 * @returns A promise that resolves with the user object.
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    // The backend now returns camelCase, so no mapping is needed.
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw new Error('Failed to fetch current user.');
  }
};

export const getUserProgress = async (): Promise<UserOverallProgress> => {
  try {
    // The user ID will be extracted from the token on the backend.
    const response = await api.get<UserOverallProgress>('/users/me/progress');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user progress:', error);
    throw new Error('Failed to fetch user progress.');
  }
};

export const getUserPreferences = async (): Promise<UserPreferences> => {
    try {
        const response = await api.get<UserPreferences>('/users/me/preferences');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user preferences:', error);
        throw new Error('Failed to fetch user preferences.');
    }
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<UserPreferences> => {
    try {
        const response = await api.put<UserPreferences>('/users/me/preferences', { preferences });
        return response.data;
    } catch (error) {
        console.error('Failed to save user preferences:', error);
        throw new Error('Failed to save user preferences.');
    }
};

export const recordContentCompletion = async (contentId: number): Promise<void> => {
  try {
    await api.post(`/users/me/progress/content/${contentId}`);
  } catch (error) {
    console.error('Failed to record content completion:', error);
    // We can choose to throw or not, depending on whether the UI needs to react to this failure.
    // For now, we log the error but don't throw, so the UI doesn't show a breaking error.
  }
};

// === USER SEARCH FUNCTION ===

/**
 * Searches for users by name or email for friend discovery.
 * @param searchQuery - The search query string (minimum 2 characters)
 * @param limit - Maximum number of results to return (default: 20, max: 50)
 * @returns A promise that resolves with the search results
 */
export const searchUsers = async (searchQuery: string, limit: number = 20): Promise<any> => {
  try {
    // Validate search query
    if (!searchQuery || searchQuery.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('q', searchQuery.trim());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/users/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to search users:', error);
    throw new Error('Failed to search users.');
  }
};

// === FRIEND MANAGEMENT FUNCTIONS ===

/**
 * Sends a friend request to another user.
 * @param friendId - The ID of the user to send a friend request to
 * @returns A promise that resolves with the friendship data
 */
export const sendFriendRequest = async (friendId: number): Promise<any> => {
  try {
    const response = await api.post(`/users/me/friends/request/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to send friend request:', error);
    throw new Error('Failed to send friend request.');
  }
};

/**
 * Accepts a pending friend request.
 * @param friendshipId - The ID of the friendship to accept
 * @returns A promise that resolves with the updated friendship data
 */
export const acceptFriendRequest = async (friendshipId: number): Promise<any> => {
  try {
    const response = await api.put(`/users/me/friends/accept/${friendshipId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to accept friend request:', error);
    throw new Error('Failed to accept friend request.');
  }
};

/**
 * Rejects a pending friend request.
 * @param friendshipId - The ID of the friendship to reject
 * @returns A promise that resolves when the request is rejected
 */
export const rejectFriendRequest = async (friendshipId: number): Promise<any> => {
  try {
    const response = await api.delete(`/users/me/friends/reject/${friendshipId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to reject friend request:', error);
    throw new Error('Failed to reject friend request.');
  }
};

/**
 * Removes an existing friend.
 * @param friendId - The ID of the friend to remove
 * @returns A promise that resolves when the friend is removed
 */
export const removeFriend = async (friendId: number): Promise<any> => {
  try {
    const response = await api.delete(`/users/me/friends/remove/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to remove friend:', error);
    throw new Error('Failed to remove friend.');
  }
};

/**
 * Blocks a user.
 * @param userId - The ID of the user to block
 * @returns A promise that resolves with the friendship data
 */
export const blockUser = async (userId: number): Promise<any> => {
  try {
    const response = await api.post(`/users/me/friends/block/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to block user:', error);
    throw new Error('Failed to block user.');
  }
};

/**
 * Gets all friends for the authenticated user.
 * @param includePending - Whether to include pending requests (default: false)
 * @param includeBlocked - Whether to include blocked users (default: false)
 * @returns A promise that resolves with the user's friends list
 */
export const getUserFriends = async (includePending: boolean = false, includeBlocked: boolean = false): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (includePending) params.append('includePending', 'true');
    if (includeBlocked) params.append('includeBlocked', 'true');
    
    const queryString = params.toString();
    const url = queryString ? `/users/me/friends?${queryString}` : '/users/me/friends';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user friends:', error);
    throw new Error('Failed to fetch user friends.');
  }
};

/**
 * Gets all pending friend requests for the authenticated user.
 * @returns A promise that resolves with the pending friend requests
 */
export const getFriendRequests = async (): Promise<any> => {
  try {
    const response = await api.get('/users/me/friends/requests');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch friend requests:', error);
    throw new Error('Failed to fetch friend requests.');
  }
};

/**
 * Gets friendship status with another user.
 * @param friendId - The ID of the user to check friendship status with
 * @returns A promise that resolves with the friendship status
 */
export const getFriendshipStatus = async (friendId: number): Promise<any> => {
  try {
    const response = await api.get(`/users/me/friends/status/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get friendship status:', error);
    throw new Error('Failed to get friendship status.');
  }
};
