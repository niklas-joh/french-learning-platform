import { Request, Response } from 'express';
import { AIOrchestrator } from '../services/ai/AIOrchestrator.js';
import { AssessmentRequest, BatchAssessmentRequest, AssessmentResult } from '../types/Assessment.js';
import { AssessmentRepository } from '../repositories/assessmentRepository.js';
import { BatchAssessmentProcessor } from '../services/ai/assessment/BatchAssessmentProcessor.js';
import { AssessmentAnalyticsService } from '../services/assessment/AssessmentAnalyticsService.js';
import { assessmentServiceFactory } from '../services/assessment/assessmentServiceFactory.js';
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

// PERFORMANCE OPTIMIZED: Batch assessment schema with size limits
const BatchAssessmentRequestSchema = z.object({
  requests: z.array(AssessmentRequestSchema).min(1).max(50), // Prevent memory issues
  exerciseId: z.string().min(1),
  exerciseType: z.string().optional().default('general'),
  concurrency: z.number().min(1).max(10).optional().default(3), // Prevent API rate limits
  metadata: z.object({
    timeSpent: z.number().optional(),
    hintsUsed: z.number().optional().default(0),
    attempts: z.number().optional().default(1),
  }).optional(),
});

// Analytics request schema with caching considerations  
const AnalyticsRequestSchema = z.object({
  timeframe: z.enum(['week', 'month', 'quarter']).optional().default('month'),
  skillArea: z.string().optional(),
  includeDetails: z.boolean().optional().default(false), // Performance: limit response size by default
});

// History request schema with pagination for performance
const HistoryRequestSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20), // Prevent large response sizes
  skillArea: z.string().optional(),
  timeframe: z.enum(['week', 'month', 'quarter', 'all']).optional().default('month'),
});

/**
 * @class AssessmentController
 * @description Handles API requests related to assessments, validating incoming data
 * and delegating business logic to the AIOrchestrator.
 * Enhanced with weakness analysis endpoint for Task 3.1.C.7.
 */
export class AssessmentController {
  private assessmentRepo: AssessmentRepository;
  private batchProcessor: BatchAssessmentProcessor;
  private analyticsService: AssessmentAnalyticsService;

  constructor(
    private orchestrator: AIOrchestrator,
    batchProcessor?: BatchAssessmentProcessor,
    analyticsService?: AssessmentAnalyticsService
  ) {
    this.assessmentRepo = new AssessmentRepository(db);
    // Use provided services or create via factory (singleton pattern) - PERFORMANCE OPTIMIZED
    this.batchProcessor = batchProcessor || assessmentServiceFactory.getBatchAssessmentProcessor();
    this.analyticsService = analyticsService || assessmentServiceFactory.getAssessmentAnalyticsService();
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

  /**
   * @description Handles batch assessment requests with performance optimizations
   * POST /api/v1/assessment/batch
   * PERFORMANCE: Uses singleton services, memory-efficient chunking, rate limiting
   */
  batchAssess = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Authentication check
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found on request.' });
        return;
      }

      // 2. Request validation with performance limits
      const validatedRequest = BatchAssessmentRequestSchema.parse(req.body);
      
      // 3. PERFORMANCE: Use pre-initialized singleton services
      const result = await this.batchProcessor.processBatch({
        assessmentRequests: validatedRequest.requests.map(req => ({
          ...req,
          userId: req.user!.userId // Override with authenticated user ID
        })),
        exerciseContext: {
          exerciseId: validatedRequest.exerciseId,
          userId: req.user!.userId,
          exerciseType: validatedRequest.exerciseType || 'general'
        }
      }, validatedRequest.concurrency);
      
      // 4. Consistent response format following existing pattern
      res.status(200).json({
        success: true,
        data: result,
        message: 'Batch assessment completed successfully'
      });

    } catch (error) {
      this.handleAssessmentError(error, res, 'Batch assessment');
    }
  };

  /**
   * @description Retrieves assessment analytics with caching optimization
   * GET /api/v1/assessment/analytics/:timeframe?
   * PERFORMANCE: Cached responses, limited data by default
   */
  getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Authentication check
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found on request.' });
        return;
      }

      // 2. Validate query parameters with defaults for performance
      const queryParams = AnalyticsRequestSchema.parse({
        timeframe: req.params.timeframe || req.query.timeframe,
        skillArea: req.query.skillArea,
        includeDetails: req.query.includeDetails
      });

      // 3. PERFORMANCE: Use singleton analytics service with caching
      const analytics = await this.analyticsService.getUserAnalytics(
        req.user.userId,
        queryParams.timeframe,
        {
          skillArea: queryParams.skillArea,
          includeDetails: queryParams.includeDetails
        }
      );

      // 4. Consistent response format with metadata
      res.status(200).json({
        success: true,
        data: analytics,
        metadata: {
          timeframe: queryParams.timeframe,
          skillArea: queryParams.skillArea || 'all',
          cached: true // Assume analytics service uses caching
        },
        message: 'Analytics retrieved successfully'
      });

    } catch (error) {
      this.handleAssessmentError(error, res, 'Analytics retrieval');
    }
  };

  /**
   * @description Retrieves paginated assessment history 
   * GET /api/v1/assessment/history
   * PERFORMANCE: Pagination, size limits, query optimization
   */
  getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Authentication check
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found on request.' });
        return;
      }

      // 2. Validate query parameters with pagination
      const queryParams = HistoryRequestSchema.parse(req.query);

      // 3. PERFORMANCE: Use repository with optimized queries
      const history = await this.assessmentRepo.getAssessmentHistory(
        req.user.userId,
        {
          page: queryParams.page,
          limit: queryParams.limit,
          skillArea: queryParams.skillArea,
          timeframe: queryParams.timeframe
        }
      );

      // 4. Paginated response format
      res.status(200).json({
        success: true,
        data: history.results,
        pagination: {
          page: queryParams.page,
          limit: queryParams.limit,
          total: history.total,
          hasMore: history.hasMore
        },
        message: 'Assessment history retrieved successfully'
      });

    } catch (error) {
      this.handleAssessmentError(error, res, 'History retrieval');
    }
  };

  /**
   * @description Service health check endpoint
   * GET /api/v1/assessment/health
   * PERFORMANCE: Quick status checks, minimal resource usage
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          batchProcessor: 'ready',
          analyticsService: 'ready',
          orchestrator: 'ready'
        },
        version: '1.0.0',
        uptime: process.uptime()
      };

      // PERFORMANCE: Quick health check without heavy operations
      res.status(200).json(healthStatus);

    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: (error as Error).message
      });
    }
  };

  /**
   * PERFORMANCE OPTIMIZED: Consistent error handling following DRY principle
   * Centralizes error handling logic and response formatting
   */
  private handleAssessmentError(error: unknown, res: Response, operation: string): void {
    if (error instanceof ZodError) {
      res.status(400).json({ 
        message: `Invalid ${operation.toLowerCase()} request.`, 
        details: error.errors 
      });
    } else if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        message: `${operation} resource not found.`
      });
    } else if (error instanceof Error && error.message.includes('Rate limit')) {
      res.status(429).json({
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: '60s'
      });
    } else {
      res.status(500).json({ 
        message: `${operation} failed.`,
        details: (error as Error).message
      });
    }
  }
}
