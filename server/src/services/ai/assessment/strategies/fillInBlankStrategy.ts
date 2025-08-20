import { BaseStrategy } from './BaseStrategy.js';
import { AssessmentRequest, AssessmentResult, PersonalizedFeedback } from '../../../../types/Assessment.js';
import { IAssessmentStrategy } from './IAssessmentStrategy.js';
import { frenchUtils } from '../utils/FrenchLanguageUtils.js';

/**
 * @class FillInBlankStrategy
 * @extends BaseStrategy
 * @description A French-aware strategy for assessing fill-in-the-blank questions.
 * Uses advanced French language processing to handle accents, gender variations, 
 * contractions, and common linguistic patterns.
 */
export class FillInBlankStrategy extends BaseStrategy implements IAssessmentStrategy {
  /**
   * Creates an instance of FillInBlankStrategy.
   */
  constructor() {
    super('FillInBlankStrategy');
  }

  /**
   * Assesses a fill-in-the-blank response with French language awareness.
   * @param {AssessmentRequest} request The assessment request containing the user's response and expected answer.
   * @param {object} options Optional parameters including abort signal for cancellation.
   * @returns {Promise<AssessmentResult>} A promise that resolves to the assessment result.
   */
  public async assess(request: AssessmentRequest, options?: { signal?: AbortSignal }): Promise<AssessmentResult> {
    const startTime = Date.now();

    try {
      // Validate request
      if (typeof request.userResponse !== 'string' || typeof request.expectedAnswer !== 'string') {
        this.logger.error('Invalid request for FillInBlankStrategy', { request });
        return this.getFallbackAssessment('fill-in-blank', 'Invalid request payload.', request.userResponse);
      }

      // Check if the request was cancelled
      if (options?.signal?.aborted) {
        throw new Error('Assessment request was cancelled');
      }

      // Use French language utilities for sophisticated comparison
      const similarityScore = frenchUtils.calculateSimilarity(request.userResponse, request.expectedAnswer);
      
      this.logger.debug('French similarity analysis completed', {
        userResponse: request.userResponse,
        expectedAnswer: request.expectedAnswer,
        similarityScore
      });

      // Determine correctness based on similarity threshold
      const isCorrect = similarityScore.overall >= 0.8;
      const score = Math.round(similarityScore.overall * 100);

      // Generate French-aware feedback
      const feedback = await this.generateFrenchAwareFeedback(
        request, 
        isCorrect, 
        similarityScore, 
        score
      );

      const processingTime = Date.now() - startTime;

      return {
        userResponse: request.userResponse,
        score,
        isCorrect,
        feedback,
        confidence: similarityScore.confidence,
        assessmentType: 'fill-in-blank',
        processingTime,
        isFallback: false,
        metadata: {
          frenchSimilarityDetails: similarityScore.details,
          phoneticSimilarity: similarityScore.phonetic,
          semanticSimilarity: similarityScore.semantic,
          structuralSimilarity: similarityScore.structural
        }
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error('Error during fill-in-blank assessment', { error, request });
      
      const result = this.getFallbackAssessment('fill-in-blank', (error as Error).message, request.userResponse);
      result.processingTime = processingTime;
      return result;
    }
  }

  /**
   * Generates French-aware feedback based on similarity analysis
   * @private
   * @param request The original assessment request
   * @param isCorrect Whether the answer was deemed correct
   * @param similarityScore Detailed similarity analysis
   * @param score Numerical score (0-100)
   * @returns Personalized feedback with French language considerations
   */
  private async generateFrenchAwareFeedback(
    request: AssessmentRequest,
    isCorrect: boolean,
    similarityScore: any,
    score: number
  ): Promise<PersonalizedFeedback> {
    const { details } = similarityScore;
    
    if (isCorrect) {
      const congratulatoryMessages = [
        'Excellent ! C\'est la bonne réponse.',
        'Très bien ! Votre réponse est correcte.',
        'Parfait ! Vous maîtrisez bien ce concept.',
        'Bravo ! Votre français s\'améliore.'
      ];

      let encouragement = 'Continue comme ça !';
      if (details.accentHandled) {
        encouragement = 'Excellent travail avec les accents français !';
      } else if (details.genderVariationAllowed) {
        encouragement = 'Bonne compréhension des accords de genre !';
      } else if (details.liaisonConsidered) {
        encouragement = 'Très bien avec les contractions françaises !';
      }

      return {
        message: congratulatoryMessages[Math.floor(Math.random() * congratulatoryMessages.length)],
        tone: 'congratulatory',
        suggestions: [
          'Continuez à pratiquer ce type d\'exercice',
          'Essayez des phrases plus complexes'
        ],
        encouragement,
        culturalNote: this.getRandomCulturalNote(request.context.userLevel)
      };
    }

    // Provide specific feedback based on the similarity analysis
    let feedbackMessage = `Pas tout à fait. La réponse attendue était : "${request.expectedAnswer}".`;
    const suggestions: string[] = [];
    let grammarTip: string | undefined;

    if (similarityScore.overall > 0.6) {
      feedbackMessage = `Presque ! Votre réponse "${request.userResponse}" est très proche de la réponse attendue "${request.expectedAnswer}".`;
      suggestions.push('Vous êtes sur la bonne voie !');
    }

    // Provide specific guidance based on what was detected
    if (details.accentHandled) {
      suggestions.push('Attention aux accents français (é, è, à, ç, etc.)');
      grammarTip = 'Les accents changent la prononciation et parfois le sens des mots en français.';
    }

    if (details.genderVariationAllowed) {
      suggestions.push('Vérifiez l\'accord en genre (masculin/féminin)');
      grammarTip = 'En français, les adjectifs s\'accordent avec le genre du nom qu\'ils qualifient.';
    }

    if (details.liaisonConsidered) {
      suggestions.push('Attention aux contractions (l\', d\', c\', etc.)');
      grammarTip = 'Les contractions sont courantes en français parlé et écrit.';
    }

    // General suggestions based on user level
    if (request.context.userLevel === 'A1' || request.context.userLevel === 'A2') {
      suggestions.push('Révisez le vocabulaire de base', 'Pratiquez la conjugaison des verbes courants');
    } else {
      suggestions.push('Révisez les règles grammaticales', 'Pratiquez avec des textes authentiques');
    }

    return {
      message: feedbackMessage,
      tone: similarityScore.overall > 0.5 ? 'encouraging' : 'corrective',
      suggestions,
      grammarTip,
      corrections: [request.expectedAnswer],
      encouragement: 'Ne vous découragez pas, le français est une langue complexe !'
    };
  }

  /**
   * Provides cultural notes based on user level
   * @private
   * @param level User's French proficiency level
   * @returns A random cultural note appropriate for the level
   */
  private getRandomCulturalNote(level: string): string | undefined {
    const culturalNotes = {
      'A1': [
        'En France, on dit "Bonjour" le matin et "Bonsoir" le soir.',
        'Les Français utilisent beaucoup les contractions dans la conversation.',
        'Le français a deux genres : masculin et féminin.'
      ],
      'A2': [
        'L\'accent aigu (é) et l\'accent grave (è) changent la prononciation du "e".',
        'En français familier, on utilise souvent des contractions comme "j\'suis" pour "je suis".',
        'Les Français apprécient quand les étrangers font l\'effort de bien prononcer.'
      ],
      'B1': [
        'Le subjonctif est plus utilisé en français qu\'en anglais.',
        'Les liaisons sont importantes dans la prononciation française.',
        'Chaque région de France a ses expressions particulières.'
      ],
      'B2': [
        'Le français standard diffère parfois du français parlé dans les médias.',
        'La langue française évolue constamment avec de nouveaux mots et expressions.',
        'Les niveaux de langue (familier, soutenu) sont importants en français.'
      ]
    };

    const levelNotes = culturalNotes[level as keyof typeof culturalNotes] || culturalNotes.A1;
    return levelNotes[Math.floor(Math.random() * levelNotes.length)];
  }
}
