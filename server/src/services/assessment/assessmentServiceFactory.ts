/**
 * @file Assessment Service Factory - Dependency injection factory for assessment services
 * @description Provides factory methods for creating assessment services with proper
 * dependency injection, following the established factory pattern in the codebase.
 * 
 * This factory follows the Dependency Injection principle from development principles
 * by providing a centralized way to create and configure assessment services.
 * 
 * @author AI Development Team
 * @since Task 3.1.C.3.refactor.3
 */

import { AssessmentQueryService } from './AssessmentQueryService.js';
import { AssessmentAnalyticsService } from './AssessmentAnalyticsService.js';
import { AssessmentPersistenceService, AssessmentPersistenceConfig } from './AssessmentPersistenceService.js';
import { WeaknessAnalysisService } from '../ai/assessment/WeaknessAnalysisService.js';
import { AssessmentRepository } from '../../repositories/assessmentRepository.js';
import { PromptTemplateEngine } from '../ai/PromptTemplateEngine.js';
import { FrenchLanguageUtils } from '../ai/assessment/utils/FrenchLanguageUtils.js';
import db from '../../config/db.js';
import { aiConfig } from '../../config/aiConfig.js';
import { OpenAI } from 'openai';
import { createLogger } from '../../utils/logger.js';

/**
 * Configuration options for the assessment service factory
 */
export interface AssessmentServiceFactoryConfig {
  /** Configuration for persistence service */
  persistence?: Partial<AssessmentPersistenceConfig>;
  /** Enable caching for analytics queries (default: true) */
  enableAnalyticsCache?: boolean;
  /** Enable debug logging (default: false) */
  enableDebugLogging?: boolean;
}

/**
 * Complete assessment service suite with all dependencies injected
 */
export interface AssessmentServices {
  /** Query service for database operations */
  queryService: AssessmentQueryService;
  /** Analytics service for calculations and insights */
  analyticsService: AssessmentAnalyticsService;
  /** Persistence service for data storage */
  persistenceService: AssessmentPersistenceService;
  /** Weakness analysis service for async pattern analysis (Task 3.1.C.7) */
  weaknessAnalysisService: WeaknessAnalysisService;
}

/**
 * AssessmentServiceFactory provides centralized creation and configuration of assessment services.
 * 
 * This factory follows the established patterns in the codebase:
 * - Uses factory functions for dependency injection (like aiServiceFactory)
 * - Provides both individual service creation and complete service suites
 * - Maintains proper dependency relationships between services
 * - Supports configuration injection for flexible service behavior
 * 
 * The factory ensures that services are created with proper dependencies:
 * - AssessmentAnalyticsService depends on AssessmentQueryService
 * - All services can be configured independently
 * - Services can be created individually or as a complete suite
 * 
 * @example
 * ```typescript
 * // Create individual services
 * const queryService = assessmentServiceFactory.createQueryService();
 * const analyticsService = assessmentServiceFactory.createAnalyticsService(queryService);
 * 
 * // Create complete service suite
 * const services = assessmentServiceFactory.createAssessmentServices({
 *   persistence: { enableCaching: true },
 *   enableAnalyticsCache: true
 * });
 * ```
 */
export class AssessmentServiceFactory {
  
  /**
   * Creates a new AssessmentQueryService instance.
   * 
   * The query service handles all database query operations for assessments,
   * using the existing AIGeneratedContent model patterns.
   * 
   * @returns Configured AssessmentQueryService instance
   * 
   * @example
   * ```typescript
   * const queryService = factory.createQueryService();
   * const stats = await queryService.getBasicAssessmentStats(123);
   * ```
   */
  static createQueryService(): AssessmentQueryService {
    return new AssessmentQueryService();
  }

  /**
   * Creates a new AssessmentAnalyticsService instance with injected dependencies.
   * 
   * The analytics service requires a query service for data access and focuses
   * solely on calculations, analysis, and insight generation.
   * 
   * @param queryService - The query service for data access (optional, will create if not provided)
   * @returns Configured AssessmentAnalyticsService instance
   * 
   * @example
   * ```typescript
   * const queryService = factory.createQueryService();
   * const analyticsService = factory.createAnalyticsService(queryService);
   * const analysis = await analyticsService.analyzeUserWeaknesses(123);
   * ```
   */
  static createAnalyticsService(queryService?: AssessmentQueryService): AssessmentAnalyticsService {
    const query = queryService || this.createQueryService();
    return new AssessmentAnalyticsService(query);
  }

  /**
   * Creates a new AssessmentPersistenceService instance with configuration.
   * 
   * The persistence service handles data storage operations using the existing
   * AIGeneratedContent model with type='assessment_result'.
   * 
   * @param config - Configuration options for persistence behavior
   * @returns Configured AssessmentPersistenceService instance
   * 
   * @example
   * ```typescript
   * const persistenceService = factory.createPersistenceService({
   *   updateUserProgress: true,
   *   enableCaching: false,
   *   enableLogging: true
   * });
   * 
   * const saveResult = await persistenceService.saveAssessmentResult(result, context);
   * ```
   */
  static createPersistenceService(config?: Partial<AssessmentPersistenceConfig>): AssessmentPersistenceService {
    return new AssessmentPersistenceService(config);
  }

  /**
   * Creates a complete assessment service suite with all dependencies properly injected.
   * 
   * This method creates all three assessment services with proper dependency
   * relationships and shared configuration. It's the recommended way to get
   * a complete set of assessment services for use in controllers or other services.
   * 
   * @param config - Configuration options for the service suite
   * @returns Complete AssessmentServices object with all services configured
   * 
   * @example
   * ```typescript
   * const services = assessmentServiceFactory.createAssessmentServices({
   *   persistence: { 
   *     updateUserProgress: true,
   *     enableCaching: true 
   *   },
   *   enableAnalyticsCache: true,
   *   enableDebugLogging: false
   * });
   * 
   * // Use the services
   * const saveResult = await services.persistenceService.saveAssessmentResult(result, context);
   * const analysis = await services.analyticsService.analyzeUserWeaknesses(123);
   * const stats = await services.queryService.getBasicAssessmentStats(123);
   * ```
   */
  static createAssessmentServices(config: AssessmentServiceFactoryConfig = {}): AssessmentServices {
    const {
      persistence = {},
      enableAnalyticsCache = true,
      enableDebugLogging = false
    } = config;

    // Apply debug logging to persistence config if enabled
    const persistenceConfig = {
      ...persistence,
      enableLogging: enableDebugLogging || persistence.enableLogging || false
    };

    // Create services with proper dependency injection
    const queryService = this.createQueryService();
    const analyticsService = this.createAnalyticsService(queryService);
    const persistenceService = this.createPersistenceService(persistenceConfig);
    const weaknessAnalysisService = this.createWeaknessAnalysisService(analyticsService);

    // TODO: Add caching wrapper for analytics service if enabled
    // if (enableAnalyticsCache) {
    //   analyticsService = new CachedAssessmentAnalyticsService(analyticsService);
    // }

    return {
      queryService,
      analyticsService,
      persistenceService,
      weaknessAnalysisService
    };
  }

  /**
   * Creates services optimized for development environment.
   * 
   * Enables debug logging and other development-friendly configurations.
   * 
   * @returns AssessmentServices configured for development
   * 
   * @example
   * ```typescript
   * const devServices = assessmentServiceFactory.createDevelopmentServices();
   * // All services will have debug logging enabled
   * ```
   */
  static createDevelopmentServices(): AssessmentServices {
    return this.createAssessmentServices({
      persistence: {
        enableLogging: true,
        updateUserProgress: true,
        enableCaching: false // Disable caching in dev for fresh data
      },
      enableAnalyticsCache: false,
      enableDebugLogging: true
    });
  }

  /**
   * Creates services optimized for production environment.
   * 
   * Enables performance optimizations like caching and disables debug logging.
   * 
   * @returns AssessmentServices configured for production
   * 
   * @example
   * ```typescript
   * const prodServices = assessmentServiceFactory.createProductionServices();
   * // All services will have performance optimizations enabled
   * ```
   */
  static createProductionServices(): AssessmentServices {
    return this.createAssessmentServices({
      persistence: {
        enableLogging: false,
        updateUserProgress: true,
        enableCaching: true
      },
      enableAnalyticsCache: true,
      enableDebugLogging: false
    });
  }

  /**
   * Creates a new WeaknessAnalysisService instance with all required dependencies.
   * 
   * The weakness analysis service handles async processing of user assessment patterns
   * to identify learning strengths and weaknesses. It integrates with existing
   * assessment infrastructure and French language utilities.
   * 
   * @param analyticsService - Optional analytics service (will create if not provided)
   * @returns Configured WeaknessAnalysisService instance
   * 
   * @example
   * ```typescript
   * const weaknessService = factory.createWeaknessAnalysisService();
   * await weaknessService.performAnalysis(userId, 30);
   * ```
   */
  static createWeaknessAnalysisService(analyticsService?: AssessmentAnalyticsService): WeaknessAnalysisService {
    const analytics = analyticsService || this.createAnalyticsService();
    const assessmentRepo = new AssessmentRepository(db);
    const promptEngine = new PromptTemplateEngine();
    const frenchUtils = new FrenchLanguageUtils();
    const logger = createLogger('weakness-analysis-service');

    const openai = new OpenAI(aiConfig.openai);
    
    return new WeaknessAnalysisService(
      assessmentRepo,
      promptEngine,
      analytics,
      frenchUtils,
      openai,
      logger
    );
  }

  /**
   * Creates services optimized for testing environment.
   * 
   * Disables side effects like user progress updates and external integrations.
   * 
   * @returns AssessmentServices configured for testing
   * 
   * @example
   * ```typescript
   * const testServices = assessmentServiceFactory.createTestServices();
   * // Services will not update user progress or trigger side effects
   * ```
   */
  static createTestServices(): AssessmentServices {
    return this.createAssessmentServices({
      persistence: {
        enableLogging: false,
        updateUserProgress: false, // Don't update progress in tests
        enableCaching: false
      },
      enableAnalyticsCache: false,
      enableDebugLogging: false
    });
  }

  /**
   * Gets factory information and service statistics.
   * 
   * @returns Factory metadata and service information
   */
  static getFactoryInfo() {
    return {
      factory: 'AssessmentServiceFactory',
      version: '1.0.0',
      services: [
        'AssessmentQueryService',
        'AssessmentAnalyticsService', 
        'AssessmentPersistenceService',
        'WeaknessAnalysisService'
      ],
      patterns: [
        'dependency_injection',
        'factory_pattern',
        'single_responsibility_principle',
        'configuration_injection'
      ],
      environments: [
        'development',
        'production',
        'testing'
      ],
      features: [
        'service_suite_creation',
        'individual_service_creation',
        'environment_specific_configurations',
        'dependency_management'
      ]
    };
  }
}

/**
 * Default factory instance for convenient access.
 * 
 * This provides a convenient way to access factory methods without
 * instantiating the class, following the established patterns in the codebase.
 * 
 * @example
 * ```typescript
 * import { assessmentServiceFactory } from './assessmentServiceFactory.js';
 * 
 * const services = assessmentServiceFactory.createAssessmentServices();
 * const queryService = assessmentServiceFactory.createQueryService();
 * ```
 */
export const assessmentServiceFactory = AssessmentServiceFactory;