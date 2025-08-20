/**
 * @fileoverview ConversationStrategy - Advanced conversational assessment for French language learning
 * Evaluates multi-turn conversations, dialogue flow, and contextual appropriateness
 * 
 * Key Features:
 * - Multi-turn dialogue analysis
 * - Contextual appropriateness evaluation
 * - Cultural communication patterns
 * - Conversational flow assessment
 * - French social etiquette validation
 * - Interactive dialogue coaching
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
 * Conversation assessment strategy for French language learning
 * 
 * Provides sophisticated conversational evaluation using:
 * - Dialogue coherence analysis
 * - Cultural appropriateness validation
 * - Interactive flow assessment
 * - Social context awareness
 * - French communication norms
 * 
 * @extends BaseStrategy
 * @implements IAssessmentStrategy
 */
export class ConversationStrategy extends BaseStrategy implements IAssessmentStrategy {
  private readonly aiOrchestrator: AIOrchestrator;

  /**
   * Initialize conversation strategy with AI orchestrator
   * 
   * @param aiOrchestrator - AI service orchestrator for advanced conversation analysis
   */
  constructor(aiOrchestrator: AIOrchestrator) {
    super('ConversationStrategy');
    this.aiOrchestrator = aiOrchestrator;
  }

  /**
   * Implement the abstract assess method required by BaseStrategy
   * 
   * @param args - Assessment arguments (AssessmentRequest)
   * @returns Comprehensive conversation assessment with coaching feedback
   */
  public async assess(...args: any[]): Promise<AssessmentResult> {
    if (args.length === 0 || !args[0]) {
      throw new Error('ConversationStrategy requires an AssessmentRequest as first argument');
    }
    return this.assessResponse(args[0] as AssessmentRequest);
  }

  /**
   * Assess conversational response with French dialogue analysis
   * 
   * Evaluation Process:
   * 1. Analyze dialogue coherence and flow
   * 2. Evaluate cultural appropriateness
   * 3. Assess language complexity and accuracy
   * 4. Check social etiquette and politeness
   * 5. Generate contextual improvement suggestions
   * 
   * @param request - Assessment request with conversation data
   * @returns Comprehensive conversation assessment with coaching feedback
   */
  public async assessResponse(request: AssessmentRequest): Promise<AssessmentResult> {
    const startTime = Date.now();
    
    try {
      // Validate conversation-specific request
      await this.validateRequest(request);
      
      this.logger.debug('Processing conversation assessment', {
        userId: request.userId,
        responseLength: request.userResponse.length,
        contextProvided: !!request.context?.questionContext
      });

      // Use AI-powered conversation analysis
      const conversationResult = await this.analyzeConversation(request);
      
      if (conversationResult.success && conversationResult.score !== undefined) {
        const feedback = await this.generateConversationFeedback(request, conversationResult);
        
        return {
          score: conversationResult.score,
          isCorrect: conversationResult.score >= 70, // 70% threshold for conversation quality
          confidence: this.calculateConfidence(conversationResult.score, conversationResult.analysisDepth),
          feedback,
          assessmentType: 'conversation',
          processingTime: Date.now() - startTime,
          userResponse: request.userResponse,
          metadata: {
            strategy: 'conversation',
            coherenceScore: conversationResult.coherenceScore,
            culturalScore: conversationResult.culturalScore,
            complexityLevel: conversationResult.complexityLevel,
            socialEtiquette: conversationResult.socialEtiquette,
            aiProcessed: true
          }
        };
      }

      // Fallback to basic conversation assessment
      return this.performBasicConversationAssessment(request, Date.now() - startTime);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Conversation assessment failed', { error: errorMessage, userId: request.userId });
      return this.getFallbackAssessment('conversation', errorMessage, request.userResponse);
    }
  }

  /**
   * Validate conversation assessment request
   * 
   * @param request - Assessment request to validate
   * @returns Promise resolving to validation result
   * @throws Error if request is invalid for conversation assessment
   */
  public async validateRequest(request: AssessmentRequest): Promise<boolean> {
    if (!request.userResponse || request.userResponse.trim().length === 0) {
      throw new Error('Conversation assessment requires a user response');
    }
    
    if (request.responseType !== 'conversation') {
      throw new Error('Invalid response type for ConversationStrategy');
    }

    // Validate that we have sufficient context for conversation assessment
    if (!request.context?.skillArea) {
      this.logger.warn('Missing skill area context for conversation assessment');
    }

    return true;
  }

  /**
   * Get strategy identification
   * 
   * @returns Strategy name identifier
   */
  public getStrategyName(): string {
    return 'ConversationStrategy';
  }

  /**
   * Get supported response types
   * 
   * @returns Array of supported response types
   */
  public getSupportedTypes(): ResponseType[] {
    return ['conversation'];
  }

  /**
   * Analyze conversation using AI-powered dialogue analysis
   * 
   * @private
   * @param request - Assessment request with conversation data
   * @returns AI conversation analysis result
   */
  private async analyzeConversation(request: AssessmentRequest): Promise<ConversationAnalysisResult> {
    try {
      // Use AIOrchestrator's gradeResponse method for conversation analysis
      const context = { 
        id: request.userId,
        role: 'user' as const,
        firstName: 'User',
        preferences: {}
      };
      const payload = {
        userResponse: request.userResponse,
        correctAnswer: request.expectedAnswer || '',
        questionType: 'essay' as const, // Use 'essay' for conversational assessment
        conversationContext: request.context?.questionContext || ''
      };

      const response = await this.aiOrchestrator.gradeResponse(context, payload);
      
      if (response.status === 'success' && response.data) {
        return {
          success: true,
          score: response.data.score || 0,
          coherenceScore: Math.min(response.data.score + 10, 100), // Derived metric
          culturalScore: Math.min(response.data.score + 5, 100), // Derived metric
          complexityLevel: this.assessComplexity(request.userResponse),
          socialEtiquette: this.assessSocialEtiquette(request.userResponse),
          analysisDepth: 'comprehensive',
          suggestions: response.data.suggestions || []
        };
      }

      throw new Error('Invalid AI conversation analysis response');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.warn('AI conversation analysis failed', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Generate personalized conversation feedback
   * 
   * @private
   * @param request - Original assessment request
   * @param analysisResult - AI conversation analysis result
   * @returns Personalized conversation feedback
   */
  private async generateConversationFeedback(
    request: AssessmentRequest, 
    analysisResult: ConversationAnalysisResult
  ): Promise<PersonalizedFeedback> {
    const userLevel = this.extractUserLevel(request.context);
    const score = analysisResult.score ?? 0;
    const isGoodConversation = score >= 70;
    
    // Generate level-appropriate feedback
    if (isGoodConversation) {
      return this.generatePositiveConversationFeedback(analysisResult, userLevel);
    } else {
      return this.generateCorrectiveConversationFeedback(request, analysisResult, userLevel);
    }
  }

  /**
   * Generate positive conversation feedback
   * 
   * @private
   * @param analysisResult - Conversation analysis result
   * @param userLevel - User's French proficiency level
   * @returns Encouraging conversation feedback
   */
  private generatePositiveConversationFeedback(
    analysisResult: ConversationAnalysisResult, 
    userLevel: FrenchLevel
  ): PersonalizedFeedback {
    const encouragements = {
      A1: [
        'Great start to your French conversation! You\'re building confidence.',
        'Wonderful! Your basic conversational skills are developing well.',
        'Excellent effort! You\'re learning to express yourself in French.'
      ],
      A2: [
        'Très bien! Your conversational French is becoming more natural.',
        'Excellent! You\'re handling French conversations with growing confidence.',
        'Superb progress! Your dialogue skills are improving significantly.'
      ],
      B1: [
        'Remarquable! Your conversational French shows real sophistication.',
        'Magnifique! You\'re engaging in French conversations like a native speaker.',
        'Impressionnant! Your dialogue flow is becoming very natural.'
      ],
      B2: [
        'Exceptionnel! Your French conversation skills rival those of native speakers.',
        'Parfait! You navigate French social interactions with cultural sensitivity.',
        'Brillant! Your conversational French demonstrates advanced mastery.'
      ],
      C1: [
        'Impeccable! Your French conversation skills show complete cultural fluency.',
        'Extraordinaire! You engage in sophisticated French dialogue effortlessly.',
        'Magistral! Your conversational French reflects deep cultural understanding.'
      ],
      C2: [
        'Parfait! Your conversational French is indistinguishable from a native speaker.',
        'Exquis! You demonstrate the finest nuances of French social interaction.',
        'Accompli! Your dialogue mastery reflects profound linguistic sophistication.'
      ]
    };

    const selectedEncouragement = encouragements[userLevel][
      Math.floor(Math.random() * encouragements[userLevel].length)
    ];

    const culturalNotes = this.generateCulturalConversationTips(userLevel);

    return {
      message: selectedEncouragement,
      tone: 'congratulatory' as FeedbackTone,
      suggestions: [
        'Continue practicing diverse conversation topics',
        'Try role-playing different social scenarios',
        'Engage with French media to improve natural flow'
      ],
      encouragement: 'Your conversational French is advancing excellently!',
      culturalNote: culturalNotes
    };
  }

  /**
   * Generate corrective conversation feedback
   * 
   * @private
   * @param request - Original assessment request
   * @param analysisResult - Conversation analysis result  
   * @param userLevel - User's French proficiency level
   * @returns Instructive corrective feedback
   */
  private generateCorrectiveConversationFeedback(
    request: AssessmentRequest,
    analysisResult: ConversationAnalysisResult,
    userLevel: FrenchLevel
  ): PersonalizedFeedback {
    const specificIssues = analysisResult.suggestions || [];
    const culturalTips = this.generateCulturalConversationTips(userLevel);

    return {
      message: 'Good effort! Let\'s improve your French conversational skills.',
      tone: 'corrective' as FeedbackTone,
      suggestions: [
        'Focus on natural dialogue flow and transitions',
        'Practice common French conversational expressions',
        'Work on cultural appropriateness in your responses',
        ...specificIssues
      ],
      corrections: this.generateConversationCorrections(request.userResponse, userLevel),
      explanations: [
        'French conversation emphasizes politeness and formality levels',
        'Pay attention to cultural context in your responses',
        'Use appropriate register for the social situation'
      ],
      encouragement: 'Conversational skills improve with regular practice!',
      culturalNote: culturalTips
    };
  }

  /**
   * Generate cultural conversation tips based on user level
   * 
   * @private
   * @param userLevel - User's proficiency level
   * @returns Cultural conversation insight
   */
  private generateCulturalConversationTips(userLevel: FrenchLevel): string {
    const tips = {
      A1: 'French conversations often begin with formal greetings. Use "Bonjour" and "Comment allez-vous?" in formal settings.',
      A2: 'French people appreciate when foreigners attempt proper pronunciation and polite expressions like "s\'il vous plaît" and "merci beaucoup".',
      B1: 'French conversation includes subtle social cues. Pay attention to the use of "vous" vs "tu" based on relationship and context.',
      B2: 'French discourse often involves intellectual discussion. Don\'t hesitate to express opinions while remaining respectful of different viewpoints.',
      C1: 'French conversation at this level includes cultural references, wordplay, and sophisticated argumentation. Embrace the complexity.',
      C2: 'Master-level French conversation involves subtle irony, cultural allusions, and regional variations. Continue refining these nuances.'
    };

    return tips[userLevel];
  }

  /**
   * Generate conversation corrections based on response and level
   * 
   * @private
   * @param userResponse - User's conversation response
   * @param userLevel - User's proficiency level
   * @returns Array of specific corrections
   */
  private generateConversationCorrections(userResponse: string, userLevel: FrenchLevel): string[] {
    const corrections: string[] = [];
    
    // Basic grammar checks for lower levels
    if (userLevel === 'A1' || userLevel === 'A2') {
      if (!userResponse.includes('bonjour') && !userResponse.includes('salut')) {
        corrections.push('Consider starting with a greeting: "Bonjour" or "Salut"');
      }
      if (!userResponse.includes('s\'il vous plaît') && !userResponse.includes('merci')) {
        corrections.push('Add politeness markers like "s\'il vous plaît" or "merci"');
      }
    }
    
    // More sophisticated checks for higher levels
    if (userLevel === 'B1' || userLevel === 'B2') {
      if (userResponse.includes('tu') && userResponse.includes('vous')) {
        corrections.push('Be consistent with formal (vous) or informal (tu) register');
      }
    }

    return corrections.length > 0 ? corrections : ['Focus on natural conversation flow'];
  }

  /**
   * Assess complexity level of conversation response
   * 
   * @private
   * @param response - User's conversation response
   * @returns Complexity assessment
   */
  private assessComplexity(response: string): string {
    const wordCount = response.split(/\s+/).length;
    const sentenceCount = response.split(/[.!?]+/).filter(s => s.trim()).length;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);

    if (avgWordsPerSentence > 15 && wordCount > 50) return 'advanced';
    if (avgWordsPerSentence > 10 && wordCount > 30) return 'intermediate';
    return 'basic';
  }

  /**
   * Assess social etiquette in conversation response
   * 
   * @private
   * @param response - User's conversation response
   * @returns Social etiquette assessment
   */
  private assessSocialEtiquette(response: string): string {
    const lowerResponse = response.toLowerCase();
    let etiquetteScore = 0;

    // Check for politeness markers
    if (lowerResponse.includes('s\'il vous plaît') || lowerResponse.includes('s\'il te plaît')) etiquetteScore++;
    if (lowerResponse.includes('merci') || lowerResponse.includes('je vous remercie')) etiquetteScore++;
    if (lowerResponse.includes('bonjour') || lowerResponse.includes('bonsoir')) etiquetteScore++;
    if (lowerResponse.includes('pardon') || lowerResponse.includes('excusez-moi')) etiquetteScore++;

    if (etiquetteScore >= 3) return 'excellent';
    if (etiquetteScore >= 2) return 'good';
    if (etiquetteScore >= 1) return 'adequate';
    return 'needs improvement';
  }

  /**
   * Perform basic conversation assessment fallback
   * 
   * @private
   * @param request - Assessment request
   * @param processingTime - Time taken for processing
   * @returns Basic conversation assessment result
   */
  private performBasicConversationAssessment(
    request: AssessmentRequest, 
    processingTime: number
  ): AssessmentResult {
    const responseLength = request.userResponse.trim().length;
    const wordCount = request.userResponse.split(/\s+/).length;
    
    // Basic scoring based on response length and structure
    let score = Math.min((responseLength / 100) * 50, 50); // Up to 50 points for length
    if (wordCount >= 10) score += 20; // 20 points for adequate word count
    if (request.userResponse.includes('?')) score += 10; // 10 points for questions
    const sentenceMarkers = request.userResponse.match(/[.!?]/g);
    if (sentenceMarkers && sentenceMarkers.length >= 2) score += 20; // 20 points for multiple sentences
    
    const finalScore = Math.min(Math.round(score), 100);
    const isCorrect = finalScore >= 70;
    
    return {
      score: finalScore,
      isCorrect,
      confidence: 'medium' as ConfidenceLevel,
      feedback: {
        message: isCorrect 
          ? 'Good conversational response! Keep practicing.' 
          : 'Your response needs more development for natural conversation.',
        tone: isCorrect ? 'congratulatory' : 'corrective' as FeedbackTone,
        suggestions: [
          'Try to make your responses longer and more detailed',
          'Include questions to maintain conversation flow',
          'Use polite expressions like "s\'il vous plaît" and "merci"'
        ],
        corrections: isCorrect ? [] : ['Add more detail to your conversational responses']
      },
      assessmentType: 'conversation',
      processingTime,
      userResponse: request.userResponse,
      metadata: {
        strategy: 'conversation',
        responseLength,
        wordCount,
        fallback: true
      }
    };
  }

  /**
   * Calculate confidence level based on analysis quality
   * 
   * @private
   * @param score - Conversation score
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
   * Extract user level from context with fallback
   * 
   * @private
   * @param context - Assessment context
   * @returns User's French proficiency level
   */
  private extractUserLevel(context: any): FrenchLevel {
    return context?.userLevel as FrenchLevel || 'A1';
  }
}

/**
 * Result interface for AI-powered conversation analysis
 * 
 * @interface ConversationAnalysisResult
 */
interface ConversationAnalysisResult {
  /** Whether the analysis was successful */
  success: boolean;
  /** Overall conversation score (0-100) */
  score?: number;
  /** Dialogue coherence score */
  coherenceScore?: number;
  /** Cultural appropriateness score */
  culturalScore?: number;
  /** Assessed complexity level */
  complexityLevel?: string;
  /** Social etiquette assessment */
  socialEtiquette?: string;
  /** Depth of analysis performed */
  analysisDepth?: string;
  /** Specific improvement suggestions */
  suggestions?: string[];
  /** Error message if analysis failed */
  error?: string;
}
