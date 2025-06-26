import { Request, Response, NextFunction } from 'express';
import * as learningPathService from '../services/learningPathService';
import { AuthenticatedRequest } from '../middleware/auth.middleware'; // Assuming this type exists

/**
 * @controller LearningPathController
 * Handles requests related to learning paths.
 */
export class LearningPathController {
  /**
   * @handler GET /api/learning-paths/:pathId/user-view
   * Retrieves a specific learning path with user progress for the authenticated user.
   * @param req Express request object, expected to be an AuthenticatedRequest.
   * @param res Express response object.
   * @param next Express next middleware function.
   */
  public async getLearningPathForUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pathIdString = req.params.pathId;
      if (!pathIdString || isNaN(parseInt(pathIdString, 10))) {
        res.status(400).json({ message: 'Valid pathId parameter is required.' });
        return;
      }
      const pathId = parseInt(pathIdString, 10);

      // Assuming req.user is populated by authentication middleware and has a 'userId' property
      if (!req.user || typeof req.user.userId !== 'number') { // Changed to userId
        // This case should ideally be caught by auth middleware, but good to double check
        res.status(401).json({ message: 'User authentication required or user ID missing.' });
        return;
      }
      const userId = req.user.userId; // Changed to userId

      const learningPathWithProgress = await learningPathService.getLearningPathUserView(pathId, userId);

      if (!learningPathWithProgress) {
        res.status(404).json({ message: `Learning path with ID ${pathId} not found.` });
        return;
      }

      res.status(200).json(learningPathWithProgress);
    } catch (error) {
      // Pass to a centralized error handler if one exists, otherwise log and send generic error
      console.error('Error in getLearningPathForUser:', error);
      next(error); // Or res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// Export an instance if you prefer singleton controllers, or use static methods
export default new LearningPathController();
