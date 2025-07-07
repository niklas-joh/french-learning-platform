import { Knex } from 'knex';
import { createHash } from 'crypto';
import { AssessmentRepository } from '../../../repositories/assessmentRepository';
import { ICacheService } from '../../common/ICacheService';
import { AssessmentRequest, AssessmentResult } from '../../../types/Assessment';
import { AssessmentStrategyFactory } from './assessmentStrategyFactory';
import { ILogger, createLogger } from '../../../utils/logger';

/**
 * @class AIAssessmentEngine
 * @description The core engine for handling AI-powered assessments.
 * It orchestrates caching, strategy selection, and execution.
 */
export class AIAssessmentEngine {
  private readonly logger: ILogger;

  /**
   * Creates an instance of AIAssessmentEngine.
   * @param {Knex} db The Knex instance for database transactions (for later tasks).
   * @param {AssessmentRepository} assessmentRepo The repository for assessment data access.
   * @param {ICacheService} cache The caching service.
   * @param {AssessmentStrategyFactory} strategyFactory The factory for creating assessment strategies.
   * @param {ILogger} [logger] Optional logger instance.
   */
  constructor(
    private readonly db: Knex,
    private readonly assessmentRepo: AssessmentRepository,
    private readonly cache: ICacheService,
    private readonly strategyFactory: AssessmentStrategyFactory,
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('AIAssessmentEngine');
  }

  /**
   * Assesses a single user response using the appropriate strategy.
   * This method handles caching, strategy selection, and execution.
   * @param {AssessmentRequest} request The assessment request data.
   * @param {{ signal?: AbortSignal }} [options] Optional parameters like the AbortSignal for cancellation.
   * @returns {Promise<AssessmentResult>} A promise that resolves to a structured AssessmentResult.
   */
  public async assessUserResponse(request: AssessmentRequest, options?: { signal?: AbortSignal }): Promise<AssessmentResult> {
    const cacheKey = this.generateCacheKey(request);
    
    try {
      const cachedResult = await this.cache.get<AssessmentResult>(cacheKey);
      if (cachedResult) {
        this.logger.info(`Cache HIT for assessment: ${request.responseType}`);
        return { ...cachedResult, metadata: { ...cachedResult.metadata, cached: true } };
      }
      this.logger.info(`Cache MISS for assessment: ${request.responseType}`);

      const strategy = this.strategyFactory.getStrategy(request.responseType);
      const result = await strategy.assess(request, options);

      if (!result.isFallback) {
        await this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      }

      return result;
    } catch (error) {
      this.logger.error('Critical error in assessUserResponse', { error, request });
      return {
        score: 0,
        isCorrect: false,
        feedback: { message: "An error occurred while assessing the response.", tone: 'neutral', suggestions: [] },
        confidence: 'low',
        assessmentType: request.responseType,
        isFallback: true,
      };
    }
  }

  /**
   * Generates a deterministic cache key for an assessment request.
   * @private
   * @param {AssessmentRequest} request The request to generate a key for.
   * @returns {string} A SHA256-based cache key.
   */
  private generateCacheKey(request: AssessmentRequest): string {
    const payload = {
      type: request.responseType,
      response: request.userResponse,
      expected: request.expectedAnswer,
      context: request.context,
    };
    const payloadString = JSON.stringify(payload);
    const hash = createHash('sha256').update(payloadString).digest('hex');
    return `assessment:${hash}`;
  }
}
