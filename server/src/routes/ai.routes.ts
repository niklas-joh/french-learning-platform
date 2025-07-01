import { Router } from 'express';
import * as aiController from '../controllers/aiController';
import { protect } from '../middleware/auth.middleware';

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
