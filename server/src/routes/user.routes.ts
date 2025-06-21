import { Router } from 'express';
import { getCurrentUserProfile, updateUserProfile, getAllUsers, getAssignedContent } from '../controllers/user.controller';
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

export default router;
