import { Request, Response } from 'express';
import { AIOrchestrator } from '../services/ai/AIOrchestrator.js';
import { AssessmentRequest } from '../types/Assessment.js';
import { AssessmentRepository } from '../repositories/assessmentRepository.js';
import db from '../config/db.js';
import { enqueueWeaknessAnalysis } from '../workers/weaknessAnalysisWorker.js';
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
 * Enhanced with weakness analysis endpoint for Task 3.1.C.7.
 */
export class AssessmentController {
  private assessmentRepo: AssessmentRepository;

  constructor(private orchestrator: AIOrchestrator) {
    this.assessmentRepo = new AssessmentRepository(db);
  }

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

  /**
   * @description Handles the API request to get user weakness analysis results.
   * Returns cached analysis results or triggers new analysis if none exists.
   * This endpoint provides fast response times by serving cached analysis results
   * from the async weakness analysis worker (Task 3.1.C.7).
   */
  getWeaknessAnalysis = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Get userId from the authenticated request object.
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found on request.' });
        return;
      }

      const userId = req.user.userId;
      
      // 2. Try to get cached analysis results first
      const cachedAnalysis = await this.assessmentRepo.getLatestWeaknessAnalysis(userId);
      
      if (cachedAnalysis) {
        // Return cached results with metadata
        res.status(200).json({
          analysis: cachedAnalysis,
          cached: true,
          generatedAt: cachedAnalysis.analyzedAt
        });
        return;
      }

      // 3. No cached analysis exists - trigger async analysis and inform user
      try {
        const jobId = await enqueueWeaknessAnalysis(userId, 'manual');
        
        res.status(202).json({
          message: 'Weakness analysis requested. Results will be available shortly.',
          jobId,
          cached: false,
          estimatedWaitTime: '2-3 minutes'
        });
      } catch (enqueueError) {
        // Fallback: return message indicating analysis is not available
        res.status(503).json({
          message: 'Weakness analysis service temporarily unavailable. Please try again later.',
          error: 'Analysis queue unavailable'
        });
      }

    } catch (error) {
      res.status(500).json({
        message: 'An unexpected error occurred while retrieving weakness analysis.',
        details: (error as Error).message
      });
    }
  };

  /**
   * @description Handles the API request to trigger a manual weakness analysis.
   * Enqueues a new analysis job regardless of existing cached results.
   * Useful for users who want fresh analysis or administrators triggering updates.
   */
  triggerWeaknessAnalysis = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Get userId from the authenticated request object.
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found on request.' });
        return;
      }

      const userId = req.user.userId;
      
      // 2. Optional timeframe parameter validation
      let timeframeDays = 30; // default
      if (req.body.timeframeDays) {
        const parsed = parseInt(req.body.timeframeDays);
        if (isNaN(parsed) || parsed < 1 || parsed > 365) {
          res.status(400).json({
            message: 'Invalid timeframeDays. Must be between 1 and 365.'
          });
          return;
        }
        timeframeDays = parsed;
      }

      // 3. Enqueue the analysis job
      const jobId = await enqueueWeaknessAnalysis(userId, 'manual', timeframeDays);
      
      res.status(202).json({
        message: 'Weakness analysis job enqueued successfully.',
        jobId,
        timeframeDays,
        estimatedWaitTime: '2-3 minutes'
      });

    } catch (error) {
      res.status(500).json({
        message: 'Failed to trigger weakness analysis.',
        details: (error as Error).message
      });
    }
  };
}
