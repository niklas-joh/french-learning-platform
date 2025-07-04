import express from 'express';
import learningPathController from '../controllers/learningPathController.js';
import { protect as authenticateToken } from '../middleware/auth.middleware.js'; // Assuming 'protect' is the auth middleware

const router = express.Router();

/**
 * @route   GET /api/learning-paths/:pathId/user-view
 * @desc    Get a specific learning path with units, lessons, and user-specific progress
 * @access  Private (Requires authentication)
 */
router.get(
  '/:pathId/user-view',
  authenticateToken, // Apply authentication middleware
  learningPathController.getLearningPathForUser
);

export default router;
