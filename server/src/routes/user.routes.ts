import { Router } from 'express';
import { getCurrentUserProfile, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getCurrentUserProfile);

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', protect, updateUserProfile);

// TODO: Define other user routes if needed

export default router;
