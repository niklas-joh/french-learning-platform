import { Request, Response } from 'express';
import { AIOrchestrator } from '../services/ai/AIOrchestrator.js';
import { AssessmentRequest } from '../types/Assessment.js';
import { ZodError, z } from 'zod';

// Basic validation schema for AssessmentRequest
const AssessmentRequestSchema = z.object({
  userId: z.number(),
  userResponse: z.string().min(1),
  expectedAnswer: z.union([z.string(), z.any()]), // Required field
  responseType: z.enum(['multiple-choice', 'fill-in-blank', 'open-ended', 'pronunciation', 'conversation', 'listening-comprehension']),
  context: z.object({
    userId: z.number(),
    lessonId: z.string().optional(),
    exerciseId: z.string().optional(),
    skillArea: z.string(),
    userLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    questionContext: z.string().optional(),
    culturalContext: z.boolean().optional(),
    previousAttempts: z.number().optional(),
  }),
  metadata: z.object({
    timeSpent: z.number().optional(),
    attempts: z.number().optional(),
    category: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }).optional(),
});

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
        .assessUserResponse(validatedRequest as AssessmentRequest);
      
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
