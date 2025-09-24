/**
 * Routes for user-centric data, including profile, progress, and gamification.
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

// Import controllers
import { 
  getCurrentUserProfile, 
  updateUserProfile, 
  getAllUsers,
  searchUsers,
  getAssignedContent, 
  getUserPreferences, 
  updateUserPreferences,
  recordContentItemProgress // This might be deprecated by recordActivityCompleted
} from '../controllers/user.controller.js';

// Import friend management controllers (separated for SRP compliance)
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  blockUser,
  getUserFriends,
  getFriendRequests,
  getFriendshipStatus
} from '../controllers/friends.controller.js';

import { 
  getUserProgress, 
  getUserStreak, 
  recordActivityCompleted 
} from '../controllers/progressController.js';

import { 
  getUserAchievements,
  checkNewAchievements
} from '../controllers/gamificationController.js';


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

// === SOCIAL FEATURES (Phase 4.3.1) - Minimal implementation ===
/**
 * Simple leaderboard endpoint using existing patterns
 * 
 * @route GET /api/users/me/social/leaderboard
 * @desc Get weekly leaderboard with top performers
 * @access Private
 * @param {number} limit - Number of entries to return (default 10)
 * @returns {Object} JSON response with leaderboard array
 */
router.get('/me/social/leaderboard', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    // REUSE: Existing database query patterns from progressService
    const { getSimpleLeaderboard } = await import('../services/progressService.js');
    const leaderboard = await getSimpleLeaderboard(limit);
    
    res.json({ 
      success: true,
      leaderboard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Error getting leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get leaderboard' 
    });
  }
});

/**
 * @route GET /api/users/search
 * @desc Search for users by name or email for friend discovery
 * @access Private
 * @param {string} q - Search query string (minimum 2 characters)
 * @param {number} limit - Maximum number of results to return (default 20, max 50)
 * @returns {Object} JSON response with filtered users array
 */
router.get('/search', protect, searchUsers);

// === FRIEND MANAGEMENT ENDPOINTS ===
/**
 * @route POST /api/users/me/friends/request/:friendId
 * @desc Send a friend request to another user
 * @access Private
 */
router.post('/me/friends/request/:friendId', protect, sendFriendRequest);

/**
 * @route PUT /api/users/me/friends/accept/:friendshipId
 * @desc Accept a pending friend request
 * @access Private
 */
router.put('/me/friends/accept/:friendshipId', protect, acceptFriendRequest);

/**
 * @route DELETE /api/users/me/friends/reject/:friendshipId
 * @desc Reject a pending friend request
 * @access Private
 */
router.delete('/me/friends/reject/:friendshipId', protect, rejectFriendRequest);

/**
 * @route DELETE /api/users/me/friends/remove/:friendId
 * @desc Remove an existing friend
 * @access Private
 */
router.delete('/me/friends/remove/:friendId', protect, removeFriend);

/**
 * @route POST /api/users/me/friends/block/:friendId
 * @desc Block a user
 * @access Private
 */
router.post('/me/friends/block/:friendId', protect, blockUser);

/**
 * @route GET /api/users/me/friends
 * @desc Get all friends for the authenticated user
 * @access Private
 */
router.get('/me/friends', protect, getUserFriends);

/**
 * @route GET /api/users/me/friends/requests
 * @desc Get all pending friend requests for the authenticated user
 * @access Private
 */
router.get('/me/friends/requests', protect, getFriendRequests);

/**
 * @route GET /api/users/me/friends/status/:friendId
 * @desc Get friendship status with another user
 * @access Private
 */
router.get('/me/friends/status/:friendId', protect, getFriendshipStatus);

// === Legacy & Admin Routes ===
// @desc    Get assigned content for the current user (Legacy, may be replaced by learning path)
router.get('/me/assignments', protect, getAssignedContent);

// @desc    Record progress for a single content item (Legacy, may be replaced by activity-completed)
router.post('/me/progress/content/:contentId', protect, recordContentItemProgress);

// @desc    Get all users (Admin only)
router.get('/', protect, isAdmin, getAllUsers);


export default router;
