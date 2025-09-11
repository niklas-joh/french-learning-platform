import { Router, Request, Response, NextFunction, RequestHandler } from 'express'; // Import RequestHandler
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All AI routes require authentication
router.use(protect);

// =================================================================
// NEW AI ORCHESTRATION ENDPOINTS
// =================================================================

/**
 * POST /api/ai/generate
 * Asynchronously generate lesson content.
 */
router.post('/generate', aiController.generateContentAsync);

/**
 * GET /api/ai/generate/status/:jobId
 * Check the status of a content generation job.
 */
router.get('/generate/status/:jobId', aiController.getGenerationStatus);

/**
 * GET /api/ai/jobs
 * Lists all content generation jobs for the authenticated user.
 */
router.get('/jobs', aiController.listJobs as RequestHandler);

/**
 * DELETE /api/ai/jobs/:jobId
 * Cancels a specific content generation job.
 */
router.delete('/jobs/:jobId', aiController.cancelJob as RequestHandler);

// =================================================================
// AI DASHBOARD ENDPOINTS
// =================================================================

/**
 * GET /api/ai/dashboard/daily-plan
 * Retrieves the user's personalized daily learning plan.
 */
router.get('/dashboard/daily-plan', aiController.getDailyPlan);

/**
 * GET /api/ai/dashboard/recommendations
 * Fetches content recommendations for the user.
 */
router.get('/dashboard/recommendations', aiController.getRecommendations);

/**
 * GET /api/ai/dashboard/analytics
 * Retrieves analytics data for the user's dashboard.
 */
router.get('/dashboard/analytics', aiController.getDashboardAnalytics);

/**
 * GET /api/ai/preferences
 * Fetches the user's AI-related preferences.
 */
router.get('/preferences', aiController.getAIPreferences);

/**
 * PUT /api/ai/preferences
 * Updates the user's AI-related preferences.
 */
router.put('/preferences', aiController.updateAIPreferences);


/**
 * POST /api/ai/assess-pronunciation
 * Assess pronunciation quality from audio recording
 */
router.post('/assess-pronunciation', aiController.assessPronunciation);

/**
 * POST /api/ai/grade-response
 * Grade user response against correct answer
 */
router.post('/grade-response', aiController.gradeResponse);

// =================================================================
// CURRICULUM API ENDPOINTS - Task 3.2.A.3
// =================================================================

/**
 * POST /api/ai/curriculum/daily-plan
 * Generate personalized daily learning plan using AI analysis of user context,
 * available time, and performance data. Uses established handleAIRequest pattern.
 */
router.post('/curriculum/daily-plan', aiController.generateDailyPlan);

/**
 * POST /api/ai/curriculum/adapt-path
 * Adapt existing learning path based on performance triggers, goal changes,
 * or time constraints. Provides intelligent modification while maintaining 
 * learning continuity.
 */
router.post('/curriculum/adapt-path', aiController.adaptLearningPath);

/**
 * GET /api/ai/curriculum/daily-plan
 * Retrieve cached daily learning plan for fast access to previously generated
 * AI recommendations. Falls back to generation if cache is empty or expired.
 */
router.get('/curriculum/daily-plan', aiController.getDailyPlan);

/**
 * GET /api/ai/curriculum/recommendations?timeAvailable=20
 * Get learning recommendations tailored to available study time and current
 * progress. Integrates with existing progress tracking for contextual suggestions.
 */
router.get('/curriculum/recommendations', aiController.getLearningRecommendations);

// =================================================================
// LEGACY ENDPOINTS - Maintained for backward compatibility
// TODO: Phase out these endpoints in favor of the new AI orchestration endpoints
// =================================================================

/**
 * POST /api/ai/chat
 * @deprecated Use the new AI orchestration endpoints instead
 */
router.post('/chat', aiController.chatWithAI);

/**
 * GET /api/ai/conversation-prompts
 * @deprecated Use the new AI orchestration endpoints instead
 */
router.get('/conversation-prompts', aiController.getPrompts);

export default router;
