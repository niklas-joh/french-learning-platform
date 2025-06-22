import { Router } from 'express';
import { getCurrentUserProfile, updateUserProfile, getAllUsers, getAssignedContent, getUserProgress, getUserPreferences, updateUserPreferences } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';

const router = Router();

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getCurrentUserProfile);

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', protect, updateUserProfile);

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get('/', protect, isAdmin, getAllUsers);

// @route   GET /api/users/me/assignments
// @desc    Get assigned content for the current user
// @access  Private
router.get('/me/assignments', protect, getAssignedContent);

// @route   GET /api/users/me/progress
// @desc    Get progress for the current user
// @access  Private
router.get('/me/progress', protect, getUserProgress);

// @route   GET /api/users/me/preferences
// @desc    Get preferences for the current user
// @access  Private
router.get('/me/preferences', protect, getUserPreferences);

// @route   PUT /api/users/me/preferences
// @desc    Update preferences for the current user
// @access  Private
router.put('/me/preferences', protect, updateUserPreferences);

export default router;
