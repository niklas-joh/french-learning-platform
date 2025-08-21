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

  return router;
};
