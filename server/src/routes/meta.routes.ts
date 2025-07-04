/**
 * Routes for application-wide metadata, such as lists of available achievements.
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';

// Import controllers
import { getAllAchievements } from '../controllers/gamificationController.js';

const router = Router();

// === Gamification Metadata ===
// @desc    Get all available achievements in the system
// @access  Private (user must be logged in to see them)
router.get('/achievements', protect, getAllAchievements);


export default router;
