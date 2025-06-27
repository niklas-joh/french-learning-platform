/**
 * Routes for user-centric data, including profile, progress, and gamification.
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';

// Import controllers
import { 
  getCurrentUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  getAssignedContent, 
  getUserPreferences, 
  updateUserPreferences,
  recordContentItemProgress // This might be deprecated by recordActivityCompleted
} from '../controllers/user.controller';

import { 
  getUserProgress, 
  getUserStreak, 
  recordActivityCompleted 
} from '../controllers/progressController';

import { 
  getUserAchievements,
  checkNewAchievements
} from '../controllers/gamificationController';


const router = Router();

// === User Profile & Preferences ===
router.get('/me', protect, getCurrentUserProfile);
router.put('/me', protect, updateUserProfile);
router.get('/me/preferences', protect, getUserPreferences);
router.put('/me/preferences', protect, updateUserPreferences);

// === User Progress & Activity ===
router.get('/me/progress', protect, getUserProgress);
router.get('/me/streak', protect, getUserStreak);
router.post('/me/activity-completed', protect, recordActivityCompleted);

// === User Gamification ===
router.get('/me/achievements', protect, getUserAchievements);
router.post('/me/achievements/check', protect, checkNewAchievements);

// === Legacy & Admin Routes ===
// @desc    Get assigned content for the current user (Legacy, may be replaced by learning path)
router.get('/me/assignments', protect, getAssignedContent);

// @desc    Record progress for a single content item (Legacy, may be replaced by activity-completed)
router.post('/me/progress/content/:contentId', protect, recordContentItemProgress);

// @desc    Get all users (Admin only)
router.get('/', protect, isAdmin, getAllUsers);


export default router;
