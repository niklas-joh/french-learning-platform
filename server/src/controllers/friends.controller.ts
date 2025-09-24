/**
 * Friends management controllers responsible for social relationship APIs.
 * Separated from user.controller.ts to follow Single Responsibility Principle.
 */
import { Request, Response } from 'express';
import { getUserById } from '../models/User.js';
import UserFriendshipModel from '../models/UserFriendship.js';

/**
 * Sends a friend request to another user.
 */
export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { friendId } = req.params;
    if (!friendId || isNaN(Number(friendId))) {
      res.status(400).json({ message: 'Invalid friend ID provided.' });
      return;
    }

    const numericFriendId = Number(friendId);
    if (userId === numericFriendId) {
      res.status(400).json({ message: 'Cannot send friend request to yourself' });
      return;
    }

    // Check if user exists
    const friend = await getUserById(numericFriendId);
    if (!friend) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if friendship already exists
    const existing = await UserFriendshipModel.getFriendshipBetweenUsers(userId, numericFriendId);
    if (existing) {
      res.status(409).json({ message: 'Friendship already exists', status: existing.status });
      return;
    }

    const friendship = await UserFriendshipModel.createFriendship({
      userId,
      friendId: numericFriendId,
      status: 'pending'
    });
    res.status(201).json({ message: 'Friend request sent successfully', friendship });
  } catch (error: any) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Failed to send friend request' });
  }
};

/**
 * Accepts a pending friend request.
 */
export const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { friendshipId } = req.params;
    if (!friendshipId || isNaN(Number(friendshipId))) {
      res.status(400).json({ message: 'Invalid friendship ID provided.' });
      return;
    }

    const numericFriendshipId = Number(friendshipId);
    
    // Verify the friendship exists and the current user is the recipient
    const friendship = await UserFriendshipModel.query().findById(numericFriendshipId);
    if (!friendship || friendship.friendId !== userId) {
      res.status(404).json({ message: 'Friend request not found' });
      return;
    }

    if (friendship.status !== 'pending') {
      res.status(400).json({ message: 'Friend request is not pending' });
      return;
    }

    const updatedFriendship = await UserFriendshipModel.updateFriendshipStatus(numericFriendshipId, 'accepted');
    res.json({ message: 'Friend request accepted successfully', friendship: updatedFriendship });
  } catch (error: any) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Failed to accept friend request' });
  }
};

/**
 * Rejects a pending friend request.
 */
export const rejectFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { friendshipId } = req.params;
    if (!friendshipId || isNaN(Number(friendshipId))) {
      res.status(400).json({ message: 'Invalid friendship ID provided.' });
      return;
    }

    const numericFriendshipId = Number(friendshipId);
    
    // Verify the friendship exists and the current user is the recipient
    const friendship = await UserFriendshipModel.query().findById(numericFriendshipId);
    if (!friendship || friendship.friendId !== userId) {
      res.status(404).json({ message: 'Friend request not found' });
      return;
    }

    if (friendship.status !== 'pending') {
      res.status(400).json({ message: 'Friend request is not pending' });
      return;
    }

    await UserFriendshipModel.deleteFriendship(friendship.userId, friendship.friendId);
    res.json({ message: 'Friend request rejected successfully' });
  } catch (error: any) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ message: 'Failed to reject friend request' });
  }
};

/**
 * Removes an existing friendship.
 */
export const removeFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { friendId } = req.params;
    if (!friendId || isNaN(Number(friendId))) {
      res.status(400).json({ message: 'Invalid friend ID provided.' });
      return;
    }

    const numericFriendId = Number(friendId);
    
    // Find the friendship
    const friendship = await UserFriendshipModel.getFriendshipBetweenUsers(userId, numericFriendId);
    if (!friendship) {
      res.status(404).json({ message: 'Friendship not found' });
      return;
    }

    if (friendship.status !== 'accepted') {
      res.status(400).json({ message: 'Cannot remove a friendship that is not accepted' });
      return;
    }

    await UserFriendshipModel.deleteFriendship(userId, numericFriendId);
    res.json({ message: 'Friend removed successfully' });
  } catch (error: any) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
};

/**
 * Blocks a user.
 */
export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { friendId } = req.params;
    if (!friendId || isNaN(Number(friendId))) {
      res.status(400).json({ message: 'Invalid user ID provided.' });
      return;
    }

    const numericFriendId = Number(friendId);
    if (userId === numericFriendId) {
      res.status(400).json({ message: 'Cannot block yourself' });
      return;
    }

    // Check if user exists
    const friend = await getUserById(numericFriendId);
    if (!friend) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if friendship already exists
    const existing = await UserFriendshipModel.getFriendshipBetweenUsers(userId, numericFriendId);
    if (existing) {
      // Update existing friendship to blocked
      const updatedFriendship = await UserFriendshipModel.updateFriendshipStatus(existing.id, 'blocked');
      res.json({ message: 'User blocked successfully', friendship: updatedFriendship });
    } else {
      // Create new blocked relationship
      const friendship = await UserFriendshipModel.createFriendship({
        userId,
        friendId: numericFriendId,
        status: 'blocked'
      });
      res.status(201).json({ message: 'User blocked successfully', friendship });
    }
  } catch (error: any) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Failed to block user' });
  }
};

/**
 * Gets all friends for the authenticated user.
 */
export const getUserFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const includePending = req.query.includePending === 'true';
    const includeBlocked = req.query.includeBlocked === 'true';
    
    // Get all friendships with user info, then filter by status in application
    const allFriends = await UserFriendshipModel.getUserFriendships(userId, undefined, true);
    
    // Filter based on query parameters
    const friends = allFriends.filter(friend => {
      if (!includePending && friend.status === 'pending') return false;
      if (!includeBlocked && friend.status === 'blocked') return false;
      return true;
    });
    
    res.json({ friends });
  } catch (error: any) {
    console.error('Error fetching user friends:', error);
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
};

/**
 * Gets all pending friend requests for the authenticated user.
 */
export const getFriendRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const requests = await UserFriendshipModel.query()
      .where('friendId', userId)
      .where('status', 'pending')
      .withGraphFetched('requester')
      .select('userFriendships.*');

    res.json({ requests });
  } catch (error: any) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Failed to fetch friend requests' });
  }
};

/**
 * Gets friendship status with another user.
 */
export const getFriendshipStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { friendId } = req.params;
    if (!friendId || isNaN(Number(friendId))) {
      res.status(400).json({ message: 'Invalid friend ID provided.' });
      return;
    }

    const numericFriendId = Number(friendId);
    
    const friendship = await UserFriendshipModel.getFriendshipBetweenUsers(userId, numericFriendId);
    
    if (!friendship) {
      res.json({ status: 'none' });
      return;
    }

    res.json({ 
      status: friendship.status,
      friendshipId: friendship.id,
      isRequester: friendship.userId === userId
    });
  } catch (error: any) {
    console.error('Error getting friendship status:', error);
    res.status(500).json({ message: 'Failed to get friendship status' });
  }
};
