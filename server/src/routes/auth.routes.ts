/**
 * Authentication related API routes.
 * 
 * Handles authentication-specific concerns only (following SRP).
 * For user profile management, see /users routes.
 */
import { Router } from 'express';
import { register, login, validateToken } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

/**
 * GET /auth/me - Validates authentication token and returns basic auth info
 * 
 * This endpoint resolves the frontend 404 errors reported in SUBTASK_02_MISSING_AUTHENTICATION_ENDPOINT.
 * Frontend AuthContext expects this endpoint to validate JWT tokens periodically.
 * 
 * Performance optimized: No database calls, returns data from validated JWT token.
 * Follows SRP: Only handles authentication validation, not full user profile data.
 * 
 * @route GET /api/v1/auth/me
 * @middleware protect - Validates JWT token and attaches user data to req.user
 * @returns {Object} Authentication status and basic user information from token
 */
router.get('/me', protect, validateToken);

// TODO: implement password reset endpoints

export default router;
