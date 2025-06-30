/**
 * User related controllers responsible for profile management and progress
 * tracking APIs.
 */
import { Request, Response } from 'express';
import { getUserById, updateUser, getAllUsers as getAllUsersFromModel } from '../models/User';
import UserContentAssignmentModel from '../models/UserContentAssignment';
import UserContentCompletionModel from '../models/UserContentCompletion';
import UserPreferenceModel from '../models/UserPreference';
import { getTopicProgress, getAssignedContentProgress } from '../models/UserProgress';

// Extend Express Request type to include the user object populated by the
// authentication middleware.
interface AuthenticatedRequest extends Request {
  user?: {
    
    userId?: number;
    id?: number;
    email?: string;
    role?: string;
  };
}

/**
 * Returns the authenticated user's profile without the password hash.
 */
export const getCurrentUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = uid;
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
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = uid;
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
export const getAssignedContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = uid;
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
export const getUserProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const userId = uid;

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
export const getUserPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.userId ?? req.user?.id;
        if (!uid || typeof uid !== 'number' || uid <= 0) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userId = uid;
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
export const updateUserPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid2 = req.user?.userId ?? req.user?.id;
        if (!uid2 || typeof uid2 !== 'number' || uid2 <= 0) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userId = uid2;
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
export const recordContentItemProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const userId = uid;
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
