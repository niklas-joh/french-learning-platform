import { Router, Request, Response, NextFunction, RequestHandler } from 'express'; // Import RequestHandler
import * as aiController from '../controllers/aiController';
import { protect, AuthenticatedRequest } from '../middleware/auth.middleware'; // Import AuthenticatedRequest

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
router.get('/jobs', aiController.listJobs as unknown as RequestHandler<AuthenticatedRequest>); // Explicit cast

/**
 * DELETE /api/ai/jobs/:jobId
 * Cancels a specific content generation job.
 */
router.delete('/jobs/:jobId', aiController.cancelJob as unknown as RequestHandler<AuthenticatedRequest>); // Explicit cast


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
