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
   * Generate content based on request parameters with retry capability
   * TODO: Reference Future Implementation #28 - Asynchronous Content Generation Workflow
   */
  generateContent(request: ContentRequest, retryCount?: number): Promise<GeneratedContent>;
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
 * Interface for background job processing
 * TODO: Reference Future Implementation #30 - AI Content Generation Job Queue System
 */
export interface IContentGenerationJobQueue {
  enqueue(request: ContentRequest): Promise<string>; // returns job ID
  getJobStatus(jobId: string): Promise<JobStatus>;
  getJobResult(jobId: string): Promise<GeneratedContent | null>;
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
  recordGenerationSuccess(request: ContentRequest, duration: number): void;
  recordGenerationFailure(request: ContentRequest, error: Error): void;
  recordValidationFailure(request: ContentRequest, validation: ContentValidation): void;
}
