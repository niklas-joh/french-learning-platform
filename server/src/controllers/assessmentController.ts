import { Request, Response } from 'express';
import { AIOrchestrator } from '../services/ai/AIOrchestrator.js';
import { AssessmentRequestSchema } from '../types/Assessment.js';
import { ZodError } from 'zod';

/**
 * @class AssessmentController
 * @description Handles API requests related to assessments, validating incoming data
 * and delegating business logic to the AIOrchestrator.
 */
export class AssessmentController {
  constructor(private orchestrator: AIOrchestrator) {}

  /**
   * @description Handles the API request to assess a single user response.
   * It validates the request body and delegates to the AI assessment engine.
   */
  assessResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate request body for a single assessment request.
      const validatedRequest = AssessmentRequestSchema.parse(req.body);
      
      // 2. Get userId from the authenticated request object.
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found on request.' });
        return;
      }

      // 3. Delegate the assessment logic to the engine via the orchestrator.
      const result = await this.orchestrator
        .getAssessmentEngine()
        .assessUserResponse(validatedRequest);
      
      res.status(200).json(result);

    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: 'Invalid request body for assessment.', 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: 'An unexpected error occurred during assessment.',
          details: (error as Error).message
        });
      }
    }
  };
}
