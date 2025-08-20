import { OpenAI } from 'openai';
import { BaseStrategy } from './BaseStrategy.js';
import { PromptTemplateEngine } from '../../PromptTemplateEngine.js';
import { AssessmentRequest, AssessmentResult } from '../../../../types/Assessment.js';
import { IAssessmentStrategy } from './IAssessmentStrategy.js';
import { ILogger } from '../../../../utils/logger.js';
import { ZodError } from 'zod';

// TODO: Add OpenEndedAssessmentResponseSchema to Assessment.ts
// import { OpenEndedAssessmentResponseSchema } from '../../../../types/Assessment.js';

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
    private promptEngine: PromptTemplateEngine
  ) {
    super('OpenEndedStrategy');
  }

  /**
   * Assesses an open-ended response using an AI model.
   * @param {AssessmentRequest} request The assessment request data.
   * @param {{ signal?: AbortSignal }} [options] Optional parameters, including an AbortSignal for cancellation.
   * @returns {Promise<AssessmentResult>} A promise that resolves to the assessment result.
   */
  public async assess(request: AssessmentRequest, options?: { signal?: AbortSignal }): Promise<AssessmentResult> {
    try {
      // TODO: Implement proper prompt generation in PromptTemplateEngine
      const prompt = `Please assess the following open-ended response in French learning context:
        Question context: ${request.context.questionContext || 'Not provided'}
        User response: "${request.userResponse}"
        Expected elements: "${request.expectedAnswer}"
        User level: ${request.context.userLevel}
        
        Please provide a JSON response with: score (0-100), feedback (message, tone, suggestions), and confidence (low/medium/high).`;

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

      // TODO: Implement proper schema validation once schema is added to Assessment.ts
      const parsed = JSON.parse(content);

      return {
        userResponse: request.userResponse,
        score: parsed.score || 0,
        isCorrect: (parsed.score || 0) >= 70,
        feedback: parsed.feedback || {
          message: 'Response processed by AI.',
          tone: 'neutral',
          suggestions: []
        },
        confidence: parsed.confidence || 'medium',
        assessmentType: 'open-ended',
        isFallback: false,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error('AI response failed Zod validation.', { errors: error.errors, request });
        return this.getFallbackAssessment('open-ended', 'AI response format was invalid.', request.userResponse);
      }
      this.logger.error('Error during open-ended assessment.', { error, request });
      return this.getFallbackAssessment('open-ended', (error as Error).message, request.userResponse);
    }
  }
}
