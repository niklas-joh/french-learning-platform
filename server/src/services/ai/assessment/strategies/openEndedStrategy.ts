import { OpenAI } from 'openai';
import { BaseStrategy } from './BaseStrategy';
import { PromptTemplateEngine } from '../../PromptTemplateEngine';
import { AssessmentRequest, AssessmentResult } from '../../../../types/Assessment';
import { IAssessmentStrategy } from './IAssessmentStrategy';
import { ILogger } from '../../../../utils/logger';
import { ZodError } from 'zod';

// Assuming a schema for the AI's response exists in Assessment.ts
import { OpenEndedAssessmentResponseSchema } from '../../../../types/Assessment';

/**
 * @class OpenEndedStrategy
 * @extends BaseStrategy
 * @description An AI-powered strategy for assessing open-ended questions.
 * It uses an AI model to evaluate the user's response and provide nuanced feedback.
 */
export class OpenEndedStrategy extends BaseStrategy implements IAssessmentStrategy {
  /**
   * Creates an instance of OpenEndedStrategy.
   * @param {OpenAI} openai The OpenAI client instance.
   * @param {PromptTemplateEngine} promptEngine The engine for generating prompts.
   * @param {ILogger} [logger] Optional logger instance.
   */
  constructor(
    private openai: OpenAI,
    private promptEngine: PromptTemplateEngine,
    logger?: ILogger
  ) {
    super('OpenEndedStrategy');
    if (logger) {
      this.logger = logger;
    }
  }

  /**
   * Assesses an open-ended response using an AI model.
   * @param {AssessmentRequest} request The assessment request data.
   * @param {{ signal?: AbortSignal }} [options] Optional parameters, including an AbortSignal for cancellation.
   * @returns {Promise<AssessmentResult>} A promise that resolves to the assessment result.
   */
  public async assess(request: AssessmentRequest, options?: { signal?: AbortSignal }): Promise<AssessmentResult> {
    try {
      const prompt = this.promptEngine.generateOpenEndedAssessmentPrompt(request);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }, { signal: options?.signal });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        this.logger.error('AI response content was empty or null.', { request });
        throw new Error('AI response was empty.');
      }

      const parsed = OpenEndedAssessmentResponseSchema.parse(JSON.parse(content));

      return {
        score: parsed.score,
        isCorrect: parsed.score >= 70,
        feedback: parsed.feedback,
        confidence: parsed.confidence,
        assessmentType: 'open-ended',
        isFallback: false,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error('AI response failed Zod validation.', { errors: error.errors, request });
        return this.getFallbackAssessment('open-ended', 'AI response format was invalid.');
      }
      this.logger.error('Error during open-ended assessment.', { error, request });
      return this.getFallbackAssessment('open-ended', (error as Error).message);
    }
  }
}
