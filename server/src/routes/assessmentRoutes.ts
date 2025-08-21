import express from 'express';
import { AssessmentController } from '../controllers/assessmentController.js';
import { protect } from '../middleware/auth.middleware.js';

/**
 * Creates and configures the assessment-related routes.
 * This factory function allows for dependency injection of the controller,
 * making the routes decoupled and easier to test.
 * @param controller An instance of AssessmentController.
 * @returns An Express router instance with the assessment routes configured.
 */
export const createAssessmentRoutes = (controller: AssessmentController): express.Router => {
  const router = express.Router();

  /**
   * @route POST /api/v1/assessment/assess
   * @description Submits a single user response for assessment by the AI engine.
   * @access Private (requires authentication)
   */
  router.post(
    '/assess',
    protect,
    controller.assessResponse
  );

  /**
   * @route GET /api/v1/assessment/analysis
   * @description Retrieves cached weakness analysis results for the authenticated user.
   * Returns cached results if available, otherwise triggers async analysis.
   * @access Private (requires authentication)
   */
  router.get(
    '/analysis',
    protect,
    controller.getWeaknessAnalysis
  );

  /**
   * @route POST /api/v1/assessment/analysis/trigger
   * @description Manually triggers a new weakness analysis for the authenticated user.
   * Enqueues analysis job regardless of existing cached results.
   * @access Private (requires authentication)
   */
  router.post(
    '/analysis/trigger',
    protect,
    controller.triggerWeaknessAnalysis
  );

  /**
   * @route POST /api/v1/assessment/batch
   * @description Processes multiple assessments in a single request with performance optimizations
   * PERFORMANCE: Rate limited for batch operations, memory-efficient processing
   * @access Private (requires authentication)
   */
  router.post(
    '/batch',
    protect,
    // PERFORMANCE: Conservative rate limiting for resource-intensive batch operations
    // rateLimitMiddleware({ maxRequests: 5, windowMs: 60000 }), // Uncomment when rate limiting middleware available
    controller.batchAssess
  );

  /**
   * @route GET /api/v1/assessment/analytics/:timeframe?
   * @description Retrieves comprehensive analytics for user assessments
   * PERFORMANCE: Cached responses, supports query parameters for optimization
   * @access Private (requires authentication)
   */
  router.get(
    '/analytics/:timeframe?',
    protect,
    // PERFORMANCE: Moderate rate limiting for analytics (cached responses)
    // rateLimitMiddleware({ maxRequests: 30, windowMs: 60000 }), // Uncomment when available
    controller.getAnalytics
  );

  /**
   * @route GET /api/v1/assessment/history
   * @description Retrieves paginated assessment history
   * PERFORMANCE: Pagination support, query optimization, reasonable rate limits
   * @access Private (requires authentication)
   */
  router.get(
    '/history',
    protect,
    // PERFORMANCE: Standard rate limiting for paginated data
    // rateLimitMiddleware({ maxRequests: 60, windowMs: 60000 }), // Uncomment when available
    controller.getHistory
  );

  /**
   * @route GET /api/v1/assessment/health
   * @description Service health check for monitoring and diagnostics
   * PERFORMANCE: Lightweight endpoint, minimal resource usage
   * @access Private (requires authentication) - could be public if needed
   */
  router.get(
    '/health',
    protect, // Remove if making this a public health check endpoint
    // PERFORMANCE: High rate limit for health checks
    // rateLimitMiddleware({ maxRequests: 120, windowMs: 60000 }), // Uncomment when available
    controller.healthCheck
  );

  return router;
};
