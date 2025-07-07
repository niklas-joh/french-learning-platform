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
   * @route POST /api/v1/assessment/grade
   * @description Submits a user's response for grading by the AI engine.
   * @access Private (requires authentication)
   */
  router.post(
    '/grade',
    protect,
    controller.gradeExercise // .bind() is not needed due to the arrow function in the controller
  );

  // Add other assessment-related routes here in the future as the feature expands.

  return router;
};
