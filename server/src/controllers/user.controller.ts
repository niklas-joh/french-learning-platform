/**
 * User related controllers responsible for profile management and progress
 * tracking APIs.
 */
import { Request, Response } from 'express';
import { getUserById, updateUser, getAllUsers as getAllUsersFromModel } from '../models/User.js';
import UserContentAssignmentModel from '../models/UserContentAssignment.js';
import UserContentCompletionModel from '../models/UserContentCompletion.js';
import UserPreferenceModel from '../models/UserPreference.js';
import { getTopicProgress, getAssignedContentProgress } from '../models/UserProgress.js';
import UserFriendshipModel from '../models/UserFriendship.js';

/**
 * Returns the authenticated user's profile without the password hash.
 */
export const getCurrentUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) { // Type error as any
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

/**
 * Updates the authenticated user's profile fields.
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { email, firstName, lastName, preferences, password } = req.body;

    if (password) {
      res.status(400).json({ message: 'Password cannot be updated through this route.' });
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ message: 'Invalid email format.' });
      return;
    }

    const updateData: { [key: string]: any } = { email, firstName, lastName, preferences };

    // Filter out null, undefined, or empty string values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null || updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update fields provided' });
      return;
    }

    const updatedUser = await updateUser(userId, updateData);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found or update failed' });
      return;
    }
    
    res.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
        res.status(409).json({ message: 'Email already taken.' });
        return;
    }
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

/**
 * Lists all users. Admin only endpoint.
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersFromModel();
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Returns all content assignments for the authenticated user.
 */
export const getAssignedContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // console.log(`[User Controller] getAssignedContent - User ID: ${userId}`); // Log removed
    const assignments = await UserContentAssignmentModel.findByUserId(userId);
    // console.log(`[User Controller] getAssignedContent - Assignments from Model: ${JSON.stringify(assignments, null, 2)}`); // Log removed
    res.json(assignments);
  } catch (error: any) {
    console.error('Error fetching assigned content:', error);
    res.status(500).json({ message: 'Failed to fetch assigned content' });
  }
};

/**
 * Aggregates progress for the authenticated user across all topics and assigned content.
 */
export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const topicProgress = await getTopicProgress(userId);
    const assignedContentProgress = await getAssignedContentProgress(userId);

    // --- Final Response ---
    const overallProgress = {
      topicProgress,
      assignedContentProgress,
    };

    res.json(overallProgress);
  } catch (error: any) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
};

/**
 * Retrieves the persisted preferences for the authenticated user.
 */
export const getUserPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const preferences = await UserPreferenceModel.findByUserId(userId);
        if (preferences) {
            res.json(JSON.parse(preferences.preferences));
        } else {
            res.json({}); // Return empty object if no preferences are set
        }
    } catch (error: any) {
        console.error('Error fetching user preferences:', error);
        res.status(500).json({ message: 'Failed to fetch user preferences' });
    }
};

/**
 * Stores new preference values for the authenticated user.
 */
export const updateUserPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { preferences } = req.body;

        if (!preferences || typeof preferences !== 'object') {
            res.status(400).json({ message: 'Invalid preferences format' });
            return;
        }

        const updatedPreference = await UserPreferenceModel.upsert(userId, preferences);
        res.json(JSON.parse(updatedPreference.preferences));
    } catch (error: any) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: 'Failed to update user preferences' });
    }
};

/**
 * Records progress for a specific content item for the authenticated user.
 * Sets the status of the corresponding user_content_assignment to 'completed'.
 */
export const recordContentItemProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const { contentId } = req.params;

    if (!contentId || isNaN(Number(contentId))) {
      res.status(400).json({ message: 'Invalid content ID provided.' });
      return;
    }

    const numericContentId = Number(contentId);

    // Check if there is an explicit assignment for this content that is not yet completed.
    const explicitAssignment = await UserContentAssignmentModel.findByUserIdAndContentId(userId, numericContentId);

    let explicitAssignmentId: number | undefined = undefined;
    if (explicitAssignment && explicitAssignment.status !== 'completed') {
      // If an explicit assignment exists and it's not completed, mark it as completed.
      await UserContentAssignmentModel.updateStatus(explicitAssignment.id, 'completed');
      explicitAssignmentId = explicitAssignment.id;
    }

    // Always record the completion event in the new table.
    const completion = await UserContentCompletionModel.create(
      userId,
      numericContentId,
      explicitAssignmentId
    );

    res.status(200).json({ message: 'Progress recorded successfully.', completion });

  } catch (error: any) {
    console.error('Error recording content progress:', error);
    res.status(500).json({ message: 'Failed to record progress.' });
  }
};

// === FRIEND MANAGEMENT CONTROLLERS ===

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

    const friendship = await UserFriendshipModel.createFriendship(userId, numericFriendId, 'pending');
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

    await UserFriendshipModel.deleteFriendship(numericFriendshipId);
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

    await UserFriendshipModel.deleteFriendship(friendship.id);
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
      const friendship = await UserFriendshipModel.createFriendship(userId, numericFriendId, 'blocked');
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
    
    const friends = await UserFriendshipModel.getUserFriendships(
      userId, 
      true, // includeUserInfo
      includePending,
      includeBlocked
    );
    
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
