// Service Interface Definitions for Dynamic Content Generation
// Follows Strategy Pattern and Dependency Injection principles

import { 
  ContentRequest, 
  GeneratedContent, 
  ContentValidation, 
  LearningContext, 
  ContentTemplate, 
  ContentType 
} from '../../types/Content';

// ========================================
// CORE CONTENT GENERATION INTERFACE
// ========================================

/**
 * Main content generation interface - streamlined to focus on essential method
 * TODO: Reference Future Implementation #22 - Abstract Service Dependencies with Interfaces
 */
export interface IContentGenerator {
  /**
   * Enqueues a content generation request and returns a job ID.
   * The actual content generation is handled asynchronously.
   * @param request The content generation request.
   * @returns A promise that resolves with the ID of the enqueued job.
   */
  generateContent(request: ContentRequest): Promise<{ jobId: string }>;
}

// ========================================
// SUPPORTING SERVICE INTERFACES
// ========================================

/**
 * Interface for content validation services
 * Uses Strategy Pattern for different content types
 */
export interface IContentValidator {
  validate(content: any, request: ContentRequest): Promise<ContentValidation>;
}

/**
 * Interface for content enhancement services
 * Adds personalization and optimization to generated content
 */
export interface IContentEnhancer {
  enhance(content: any, context: LearningContext): Promise<any>;
}

/**
 * Interface for content template management
 * Provides structured templates for different content types
 */
export interface IContentTemplateManager {
  getTemplate(type: ContentType, context: LearningContext): ContentTemplate;
}

// ========================================
// FACTORY INTERFACES
// ========================================

/**
 * Factory interface for content validators
 * Enables different validation strategies per content type
 * TODO: Reference Future Implementation #23 - Centralized Dependency Injection (DI) Container
 */
export interface IContentValidatorFactory {
  getValidator(type: ContentType): IContentValidator;
}

/**
 * Factory interface for content enhancers
 * Enables different enhancement strategies per content type
 */
export interface IContentEnhancerFactory {
  getEnhancer(type: ContentType): IContentEnhancer;
}

// ========================================
// CACHE AND CONTEXT INTERFACES
// ========================================

/**
 * Interface for caching generated content
 * TODO: Reference Future Implementation #10 - AI Response Caching Strategy
 */
export interface IContentCache {
  get(key: string): Promise<GeneratedContent | null>;
  set(key: string, content: GeneratedContent, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Interface for loading user learning context
 * TODO: Reference Future Implementation #18 - AI Context Service Optimization Strategy
 */
export interface ILearningContextService {
  getUserContext(userId: number): Promise<LearningContext>;
  updateContext(userId: number, updates: Partial<LearningContext>): Promise<void>;
}

// ========================================
// JOB QUEUE INTERFACES (Future Implementation)
// ========================================

/**
 * Interface for a job queue service.
 * This service is responsible for enqueuing jobs for asynchronous processing.
 */
export interface IJobQueueService {
  /**
   * Enqueues a job for processing.
   * @param jobData The data required to process the job.
   * @returns A promise that resolves with the ID of the enqueued job.
   */
  enqueueJob(jobData: any): Promise<string>;
}

export interface JobStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number; // 0-100
  estimatedCompletion?: Date;
  error?: string;
}

// ========================================
// ERROR HANDLING INTERFACES
// ========================================

/**
 * Interface for handling generation failures and fallbacks
 */
export interface IContentFallbackHandler {
  getFallbackContent(request: ContentRequest, error: Error): Promise<GeneratedContent>;
  shouldRetry(error: Error, retryCount: number): boolean;
}

/**
 * Interface for content generation metrics and monitoring
 * TODO: Reference Future Implementation #24 - Implement Structured Logging
 */
export interface IContentGenerationMetrics {
  recordGenerationAttempt(request: ContentRequest): void;
  recordGenerationSuccess(request: ContentRequest, duration: number, validationScore: number): void;
  recordGenerationFailure(request: ContentRequest, duration: number, error: Error): void;
  recordValidationFailure(request: ContentRequest, validation: ContentValidation): void;
  recordFallbackUsed(request: ContentRequest, error: Error): void;
}
