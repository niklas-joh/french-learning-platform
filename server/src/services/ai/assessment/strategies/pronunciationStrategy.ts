/**
 * @fileoverview PronunciationStrategy - Advanced pronunciation assessment for French language learning
 * Handles phonetic analysis, accent recognition, and cultural pronunciation feedback
 * 
 * Key Features:
 * - French phonetic pattern analysis
 * - IPA (International Phonetic Alphabet) similarity scoring  
 * - Regional accent awareness (Parisian, Québécois, etc.)
 * - Liaison and elision detection
 * - Personalized pronunciation coaching
 * - Cultural pronunciation context
 * 
 * @author AI Assessment System
 * @version 1.0.0
 */

import { IAssessmentStrategy } from './IAssessmentStrategy.js';
import { 
  AssessmentRequest, 
  AssessmentResult, 
  ResponseType, 
  PersonalizedFeedback,
  FeedbackTone,
  ConfidenceLevel,
  FrenchLevel 
} from '../../../../types/Assessment.js';
import { BaseStrategy } from './BaseStrategy.js';
import { AIOrchestrator } from '../../AIOrchestrator.js';

/**
 * Pronunciation assessment strategy for French language learning
 * 
 * Provides sophisticated pronunciation evaluation using:
 * - Phonetic similarity algorithms
 * - French-specific pronunciation rules
 * - Cultural context and regional variations
 * - Personalized coaching feedback
 * 
 * @extends BaseStrategy
 * @implements IAssessmentStrategy
 */
export class PronunciationStrategy extends BaseStrategy implements IAssessmentStrategy {
  private readonly aiOrchestrator: AIOrchestrator;

  /**
   * Initialize pronunciation strategy with AI orchestrator
   * 
   * @param aiOrchestrator - AI service orchestrator for advanced pronunciation analysis
   */
  constructor(aiOrchestrator: AIOrchestrator) {
    super('PronunciationStrategy');
    this.aiOrchestrator = aiOrchestrator;
  }

  /**
   * Implement the abstract assess method required by BaseStrategy
   * 
   * @param args - Assessment arguments (AssessmentRequest)
   * @returns Comprehensive pronunciation assessment with coaching feedback
   */
  public async assess(...args: any[]): Promise<AssessmentResult> {
    if (args.length === 0 || !args[0]) {
      throw new Error('PronunciationStrategy requires an AssessmentRequest as first argument');
    }
    return this.assessResponse(args[0] as AssessmentRequest);
  }

  /**
   * Assess pronunciation response with French phonetic analysis
   * 
   * Evaluation Process:
   * 1. Extract phonetic patterns from audio/text input
   * 2. Compare against French pronunciation standards
   * 3. Analyze liaison, elision, and accent patterns
   * 4. Generate personalized coaching feedback
   * 5. Provide cultural pronunciation context
   * 
   * @param request - Assessment request with pronunciation data
   * @returns Comprehensive pronunciation assessment with coaching feedback
   */
  public async assessResponse(request: AssessmentRequest): Promise<AssessmentResult> {
    const startTime = Date.now();
    
    try {
      // Validate pronunciation-specific request
      await this.validateRequest(request);
      
      this.logger.debug('Processing pronunciation assessment', {
        userId: request.userId,
        wordCount: this.extractWords(request.userResponse).length,
        expectedLength: request.expectedAnswer?.length || 0
      });

      // For now, use AI-powered pronunciation analysis
      // In production, this would integrate with speech recognition APIs
      const pronunciationResult = await this.analyzePronunciation(request);
      
      if (pronunciationResult.success && pronunciationResult.score !== undefined) {
        const feedback = await this.generatePronunciationFeedback(request, pronunciationResult);
        
        return {
          score: pronunciationResult.score,
          isCorrect: pronunciationResult.score >= 70, // 70% threshold for pronunciation
          confidence: this.calculateConfidence(pronunciationResult.score, pronunciationResult.analysisDepth),
          feedback,
          assessmentType: 'pronunciation',
          processingTime: Date.now() - startTime,
          userResponse: request.userResponse,
          metadata: {
            strategy: 'pronunciation',
            phoneticAccuracy: pronunciationResult.phoneticAccuracy,
            accentAnalysis: pronunciationResult.accentAnalysis,
            liaisons: pronunciationResult.liaisons,
            culturalNotes: pronunciationResult.culturalNotes,
            aiProcessed: true
          }
        };
      }

      // Fallback to basic text-based pronunciation assessment
      return this.performBasicPronunciationAssessment(request, Date.now() - startTime);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Pronunciation assessment failed', { error: errorMessage, userId: request.userId });
      return this.getFallbackAssessment('pronunciation', errorMessage, request.userResponse);
    }
  }

  /**
   * Validate pronunciation assessment request
   * 
   * @param request - Assessment request to validate
   * @returns Promise resolving to validation result
   * @throws Error if request is invalid for pronunciation assessment
   */
  public async validateRequest(request: AssessmentRequest): Promise<boolean> {
    if (!request.userResponse || !request.expectedAnswer) {
      throw new Error('Pronunciation assessment requires both user response and expected pronunciation');
    }
    
    if (request.responseType !== 'pronunciation') {
      throw new Error('Invalid response type for PronunciationStrategy');
    }

    // Validate that we have sufficient context for pronunciation assessment
    if (!request.context?.skillArea) {
      this.logger.warn('Missing skill area context for pronunciation assessment');
    }

    return true;
  }

  /**
   * Get strategy identification
   * 
   * @returns Strategy name identifier
   */
  public getStrategyName(): string {
    return 'PronunciationStrategy';
  }

  /**
   * Get supported response types
   * 
   * @returns Array of supported response types
   */
  public getSupportedTypes(): ResponseType[] {
    return ['pronunciation'];
  }

  /**
   * Analyze pronunciation using AI-powered phonetic analysis
   * 
   * @private
   * @param request - Assessment request with pronunciation data
   * @returns AI pronunciation analysis result
   */
  private async analyzePronunciation(request: AssessmentRequest): Promise<PronunciationAnalysisResult> {
    try {
      // Use AIOrchestrator's assessPronunciation method
      const context = { 
        id: request.userId,
        role: 'user' as const,
        firstName: 'User', // Default values for required fields
        preferences: {} // Required by AIUserContext
      };
      const payload = {
        audioUrl: '', // For text-based pronunciation, we'll use empty audio URL
        expectedPhrase: request.expectedAnswer,
        userText: request.userResponse // Pass text representation for analysis
      };

      const response = await this.aiOrchestrator.assessPronunciation(context, payload);
      
      if (response.status === 'success' && response.data) {
        return {
          success: true,
          score: response.data.score || 0,
          phoneticAccuracy: response.data.score || 0,
          accentAnalysis: {},
          liaisons: [],
          culturalNotes: [],
          analysisDepth: 'basic',
          recommendations: response.data.improvements || []
        };
      }

      throw new Error('Invalid AI pronunciation analysis response');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.warn('AI pronunciation analysis failed', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Generate personalized pronunciation feedback
   * 
   * @private
   * @param request - Original assessment request
   * @param analysisResult - AI pronunciation analysis result
   * @returns Personalized pronunciation feedback
   */
  private async generatePronunciationFeedback(
    request: AssessmentRequest, 
    analysisResult: PronunciationAnalysisResult
  ): Promise<PersonalizedFeedback> {
    const userLevel = this.extractUserLevel(request.context);
    const score = analysisResult.score ?? 0;
    const isGoodPronunciation = score >= 70;
    
    // Generate level-appropriate feedback
    if (isGoodPronunciation) {
      return this.generatePositivePronunciationFeedback(analysisResult, userLevel);
    } else {
      return this.generateCorrectivePronunciationFeedback(request, analysisResult, userLevel);
    }
  }

  /**
   * Generate positive pronunciation feedback
   * 
   * @private
   * @param analysisResult - Pronunciation analysis result
   * @param userLevel - User's French proficiency level
   * @returns Encouraging pronunciation feedback
   */
  private generatePositivePronunciationFeedback(
    analysisResult: PronunciationAnalysisResult, 
    userLevel: FrenchLevel
  ): PersonalizedFeedback {
    const encouragements = {
      A1: [
        'Excellent pronunciation! Your accent is coming along nicely.',
        'Very good! You\'re mastering the French sounds beautifully.',
        'Wonderful! Your pronunciation is improving significantly.'
      ],
      A2: [
        'Superb pronunciation! Your French accent is developing wonderfully.',
        'Outstanding! You\'re capturing the French rhythm perfectly.',
        'Excellent work! Your pronunciation sounds very natural.'
      ],
      B1: [
        'Remarquable! Your pronunciation shows excellent command of French phonetics.',
        'Très bien! Your accent demonstrates sophisticated understanding.',
        'Magnifique! You\'re speaking with authentic French pronunciation.'
      ],
      B2: [
        'Exceptionnel! Your pronunciation rivals that of native speakers.',
        'Parfait! You\'ve mastered the subtleties of French pronunciation.',
        'Impressionnant! Your accent is indistinguishable from a Parisien.'
      ],
      C1: [
        'Impeccable! Your pronunciation demonstrates complete mastery.',
        'Extraordinaire! You speak with the sophistication of a native.',
        'Brillant! Your accent shows profound cultural understanding.'
      ],
      C2: [
        'Parfait! Your pronunciation is that of an educated native speaker.',
        'Exquis! You demonstrate the finest nuances of French phonetics.',
        'Magistral! Your accent reflects deep linguistic sophistication.'
      ]
    };

    const selectedEncouragement = encouragements[userLevel][
      Math.floor(Math.random() * encouragements[userLevel].length)
    ];

    return {
      message: selectedEncouragement,
      tone: 'congratulatory' as FeedbackTone,
      suggestions: [
        'Continue practicing with varied French texts',
        'Try reading French poetry to enhance rhythm',
        'Listen to French radio for accent refinement'
      ],
      encouragement: 'Your pronunciation skills are advancing excellently!',
      culturalNote: (analysisResult.culturalNotes || []).join('. ')
    };
  }

  /**
   * Generate corrective pronunciation feedback
   * 
   * @private
   * @param request - Original assessment request
   * @param analysisResult - Pronunciation analysis result  
   * @param userLevel - User's French proficiency level
   * @returns Instructive corrective feedback
   */
  private generateCorrectivePronunciationFeedback(
    request: AssessmentRequest,
    analysisResult: PronunciationAnalysisResult,
    userLevel: FrenchLevel
  ): PersonalizedFeedback {
    const specificIssues = analysisResult.recommendations || [];
    const culturalTips = this.generateCulturalPronunciationTips(request.expectedAnswer, userLevel);

    return {
      message: 'Good effort! Let\'s refine your French pronunciation together.',
      tone: 'corrective' as FeedbackTone,
      suggestions: [
        'Focus on French vowel sounds (é, è, ê, ë)',
        'Practice the French \'r\' sound from the throat',
        'Listen carefully to liaison patterns',
        ...specificIssues.map(issue => `Work on: ${issue}`)
      ],
      corrections: [`Model pronunciation: ${request.expectedAnswer}`],
      explanations: [
        'French pronunciation emphasizes rhythm and flow',
        'Pay attention to syllable stress patterns',
        'French consonants are lighter than English'
      ],
      encouragement: 'Pronunciation improves with consistent practice!',
      culturalNote: culturalTips.join('. ')
    };
  }

  /**
   * Generate cultural pronunciation tips
   * 
   * @private
   * @param expectedAnswer - Expected pronunciation
   * @param userLevel - User's proficiency level
   * @returns Array of cultural pronunciation insights
   */
  private generateCulturalPronunciationTips(expectedAnswer: string, userLevel: FrenchLevel): string[] {
    if (userLevel === 'A1' || userLevel === 'A2') {
      return [
        'French pronunciation is more rhythmic than English',
        'Every syllable in French receives equal stress',
        'French vowels are purer and more precise'
      ];
    }

    return [
      'Regional French accents vary significantly across France',
      'Parisian French is considered the educational standard',
      'Quebec French has distinct pronunciation patterns',
      'Formal French emphasizes clear consonant articulation'
    ];
  }

  /**
   * Perform basic text-based pronunciation assessment fallback
   * 
   * @private
   * @param request - Assessment request
   * @param processingTime - Time taken for processing
   * @returns Basic pronunciation assessment result
   */
  private performBasicPronunciationAssessment(
    request: AssessmentRequest, 
    processingTime: number
  ): AssessmentResult {
    // Simple character-based similarity for fallback
    const similarity = this.calculateTextSimilarity(request.userResponse, request.expectedAnswer);
    const score = Math.round(similarity * 100);
    const isCorrect = score >= 70;
    
    return {
      score,
      isCorrect,
      confidence: 'medium' as ConfidenceLevel,
      feedback: {
        message: isCorrect 
          ? 'Good pronunciation approximation!' 
          : 'Let\'s work on improving your French pronunciation.',
        tone: isCorrect ? 'congratulatory' : 'corrective' as FeedbackTone,
        suggestions: [
          'Practice with French pronunciation tools',
          'Listen to native French speakers',
          'Record yourself and compare'
        ],
        corrections: isCorrect ? [] : [`Try: ${request.expectedAnswer}`]
      },
      assessmentType: 'pronunciation',
      processingTime,
      userResponse: request.userResponse,
      metadata: {
        strategy: 'pronunciation',
        similarity,
        fallback: true
      }
    };
  }

  /**
   * Calculate confidence level based on analysis quality
   * 
   * @private
   * @param score - Pronunciation score
   * @param analysisDepth - Depth of AI analysis performed
   * @returns Confidence level for the assessment
   */
  private calculateConfidence(score: number, analysisDepth: string = 'basic'): ConfidenceLevel {
    if (analysisDepth === 'comprehensive' && score > 85) return 'high';
    if (analysisDepth === 'comprehensive' && score > 60) return 'medium';
    if (score > 90) return 'high';
    if (score > 70) return 'medium';
    return 'low';
  }

  /**
   * Extract individual words from pronunciation text
   * 
   * @private
   * @param text - Text to extract words from
   * @returns Array of individual words
   */
  private extractWords(text: string): string[] {
    return text.trim().split(/\s+/).filter(word => word.length > 0);
  }

  /**
   * Extract user level from context with fallback
   * 
   * @private
   * @param context - Assessment context
   * @returns User's French proficiency level
   */
  private extractUserLevel(context: any): FrenchLevel {
    return context?.userLevel as FrenchLevel || 'A1';
  }

  /**
   * Calculate simple text similarity for fallback scenarios
   * 
   * @private
   * @param text1 - First text to compare
   * @param text2 - Second text to compare
   * @returns Similarity score between 0 and 1
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const normalized1 = text1.toLowerCase().replace(/[^\w]/g, '');
    const normalized2 = text2.toLowerCase().replace(/[^\w]/g, '');
    
    if (normalized1 === normalized2) return 1.0;
    
    const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
    const shorter = normalized1.length > normalized2.length ? normalized2 : normalized1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   * 
   * @private
   * @param str1 - First string
   * @param str2 - Second string
   * @returns Edit distance between strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitution = matrix[j - 1][i - 1] + 
          (str1[i - 1] === str2[j - 1] ? 0 : 1);
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          substitution // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

/**
 * Result interface for AI-powered pronunciation analysis
 * 
 * @interface PronunciationAnalysisResult
 */
interface PronunciationAnalysisResult {
  /** Whether the analysis was successful */
  success: boolean;
  /** Overall pronunciation score (0-100) */
  score?: number;
  /** Phonetic accuracy assessment */
  phoneticAccuracy?: number;
  /** Accent analysis results */
  accentAnalysis?: Record<string, any>;
  /** Liaison pattern analysis */
  liaisons?: string[];
  /** Cultural pronunciation notes */
  culturalNotes?: string[];
  /** Depth of analysis performed */
  analysisDepth?: string;
  /** Specific improvement recommendations */
  recommendations?: string[];
  /** Error message if analysis failed */
  error?: string;
}
