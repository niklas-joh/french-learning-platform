import { OpenAI } from 'openai';
import { ResponseType } from '../../../types/Assessment';
import { IAssessmentStrategy } from './strategies/IAssessmentStrategy';
import { MultipleChoiceStrategy } from './strategies/multipleChoiceStrategy';
import { OpenEndedStrategy } from './strategies/openEndedStrategy';
import { PromptTemplateEngine } from '../PromptTemplateEngine';
import { ILogger } from '../../../utils/logger';

/**
 * @class AssessmentStrategyFactory
 * @description A factory responsible for creating and providing the correct assessment strategy
 * based on the response type. This pattern decouples the assessment engine from the
 * concrete strategy implementations, making the system more modular and extensible.
 */
export class AssessmentStrategyFactory {
  private readonly strategies: Map<ResponseType, IAssessmentStrategy>;

  /**
   * Creates an instance of AssessmentStrategyFactory.
   * @param {OpenAI} openai The OpenAI client, passed to AI-powered strategies.
   * @param {PromptTemplateEngine} promptEngine The prompt engine, passed to AI-powered strategies.
   * @param {ILogger} logger A logger instance for logging factory-level events.
   */
  constructor(
    openai: OpenAI,
    promptEngine: PromptTemplateEngine,
    private logger: ILogger
  ) {
    this.strategies = new Map<ResponseType, IAssessmentStrategy>([
      ['multiple-choice', new MultipleChoiceStrategy()],
      ['open-ended', new OpenEndedStrategy(openai, promptEngine, this.logger)],
      // TODO: Add other strategies here as they are implemented.
      // For example:
      // ['fill-in-the-blank', new FillInTheBlankStrategy()],
      // ['pronunciation', new PronunciationStrategy(openai, someSpeechService)],
    ]);
    this.logger.info('AssessmentStrategyFactory initialized with available strategies.');
  }

  /**
   * Retrieves the appropriate assessment strategy for a given response type.
   * @param {ResponseType} type The type of the response to be assessed.
   * @returns {IAssessmentStrategy} The concrete strategy instance.
   * @throws {Error} If no strategy is found for the given type.
   */
  public getStrategy(type: ResponseType): IAssessmentStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      this.logger.error(`Unsupported assessment type requested: ${type}. No strategy found.`);
      // In a production system, you might want a default or "do-nothing" strategy
      // as a fallback, but for now, throwing an error is appropriate.
      throw new Error(`Unsupported assessment type: ${type}`);
    }
    this.logger.debug(`Strategy for type "${type}" retrieved successfully.`);
    return strategy;
  }
}
