import { OpenAI } from 'openai';
import { ResponseType } from '../../../types/Assessment.js';
import { IAssessmentStrategy } from './strategies/IAssessmentStrategy.js';
import { MultipleChoiceStrategy } from './strategies/multipleChoiceStrategy.js';
import { OpenEndedStrategy } from './strategies/openEndedStrategy.js';
import { FillInBlankStrategy } from './strategies/fillInBlankStrategy.js';
import { PronunciationStrategy } from './strategies/pronunciationStrategy.js';
import { ConversationStrategy } from './strategies/conversationStrategy.js';
import { PromptTemplateEngine } from '../PromptTemplateEngine.js';
import { ILogger } from '../../../utils/logger.js';

/**
 * @class AssessmentStrategyFactory
 * @description A factory responsible for creating and providing the correct assessment strategy
 * based on the response type. This pattern decouples the assessment engine from the
 * concrete strategy implementations, making the system more modular and extensible.
 */
export class AssessmentStrategyFactory {
  private readonly strategies: Map<ResponseType, IAssessmentStrategy>;
  private aiOrchestrator: any; // Using any to avoid circular dependency in types

  /**
   * Creates an instance of AssessmentStrategyFactory.
   * @param {OpenAI} openai The OpenAI client, passed to AI-powered strategies.
   * @param {PromptTemplateEngine} promptEngine The prompt engine, passed to AI-powered strategies.
   * @param {ILogger} logger A logger instance for logging factory-level events.
   */
  constructor(
    private openai: OpenAI,
    private promptEngine: PromptTemplateEngine,
    private logger: ILogger
  ) {
    this.strategies = new Map<ResponseType, IAssessmentStrategy>();
    this.logger.info('AssessmentStrategyFactory initialized with lazy-loading strategy pattern.');
  }

  /**
   * Sets the AIOrchestrator instance after factory creation to avoid circular dependencies
   * @param aiOrchestrator The AIOrchestrator instance
   */
  public setAIOrchestrator(aiOrchestrator: any): void {
    this.aiOrchestrator = aiOrchestrator;
    this.logger.debug('AIOrchestrator instance set in AssessmentStrategyFactory');
  }

  /**
   * Retrieves the appropriate assessment strategy for a given response type.
   * @param {ResponseType} type The type of the response to be assessed.
   * @returns {IAssessmentStrategy} The concrete strategy instance.
   * @throws {Error} If no strategy is found for the given type.
   */
  public getStrategy(type: ResponseType): IAssessmentStrategy {
    // Lazy loading: create strategy instance only when needed
    if (!this.strategies.has(type)) {
      this.strategies.set(type, this.createStrategy(type));
    }
    
    const strategy = this.strategies.get(type);
    if (!strategy) {
      this.logger.error(`Unsupported assessment type requested: ${type}. No strategy found.`);
      throw new Error(`Unsupported assessment type: ${type}`);
    }
    
    this.logger.debug(`Strategy for type "${type}" retrieved successfully.`);
    return strategy;
  }

  /**
   * Creates a new strategy instance based on the response type
   * @private
   * @param type The response type to create a strategy for
   * @returns The strategy instance
   */
  private createStrategy(type: ResponseType): IAssessmentStrategy {
    switch (type) {
      case 'multiple-choice':
        return new MultipleChoiceStrategy();
      case 'open-ended':
        return new OpenEndedStrategy(this.openai, this.promptEngine);
      case 'fill-in-blank':
        return new FillInBlankStrategy();
      case 'pronunciation':
        if (!this.aiOrchestrator) {
          throw new Error(`PronunciationStrategy requires AIOrchestrator dependency - call setAIOrchestrator first`);
        }
        return new PronunciationStrategy(this.aiOrchestrator);
      case 'conversation':
        if (!this.aiOrchestrator) {
          throw new Error(`ConversationStrategy requires AIOrchestrator dependency - call setAIOrchestrator first`);
        }
        return new ConversationStrategy(this.aiOrchestrator);
      case 'listening-comprehension':
        throw new Error(`Strategy for type "${type}" not yet implemented`);
      default:
        throw new Error(`Unknown assessment type: ${type}`);
    }
  }
}
