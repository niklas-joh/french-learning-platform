# Task 3.1.C: AI Assessment & Grading Engine

## **Task Information**
- **Task ID**: 3.1.C
- **Estimated Time**: 6 hours
- **Priority**: 🔥 Critical
- **Dependencies**: Task 3.1.A (AI Orchestration Service), Task 3.1.B (Content Generation)
- **Assignee**: [To be assigned]
- **Status**: ⏳ Not Started

## **Objective**
Implement AI-powered assessment and grading system that provides intelligent evaluation of user responses, personalized feedback, and weakness pattern analysis to drive adaptive learning.

## **Success Criteria**
- [ ] AI accurately grades multiple response types (multiple-choice, fill-in-blank, open-ended)
- [ ] Assessment accuracy > 85% compared to human grading
- [ ] Provides constructive, personalized feedback in < 3 seconds
- [ ] Identifies learning patterns and weakness areas
- [ ] Supports French language assessment with cultural context
- [ ] Tracks improvement trends over time
- [ ] Handles edge cases gracefully with confidence scoring
- [ ] Integrates seamlessly with content generation and user progress

## **Implementation Details**

### **Core Architecture**

#### **1. AI Assessment Engine Service**
```typescript
// server/src/services/aiAssessmentEngine.ts

import { OpenAI } from 'openai';
import { 
  AssessmentRequest,
  AssessmentResult,
  GradingResult,
  PersonalizedFeedback,
  WeaknessAnalysis,
  LearningContext,
  UserMistake,
  ConfidenceLevel
} from '../types/Assessment';
import { PromptTemplateEngine } from './promptTemplateEngine';
import { CacheService } from './cacheService';

export class AIAssessmentEngine {
  private openai: OpenAI;
  private promptEngine: PromptTemplateEngine;
  private cache: CacheService;

  constructor(openai: OpenAI) {
    this.openai = openai;
    this.promptEngine = new PromptTemplateEngine();
    this.cache = new CacheService();
  }

  async assessUserResponse(request: AssessmentRequest): Promise<AssessmentResult> {
    try {
      const startTime = Date.now();
      
      // Check cache for similar assessments
      const cacheKey = this.generateAssessmentCacheKey(request);
      let result = await this.cache.get(cacheKey);

      if (!result) {
        // Route to appropriate assessment method based on type
        switch (request.responseType) {
          case 'multiple-choice':
            result = await this.assessMultipleChoice(request);
            break;
          case 'fill-in-blank':
            result = await this.assessFillInBlank(request);
            break;
          case 'open-ended':
            result = await this.assessOpenEnded(request);
            break;
          case 'pronunciation':
            result = await this.assessPronunciation(request);
            break;
          case 'conversation':
            result = await this.assessConversation(request);
            break;
          default:
            throw new Error(`Unsupported response type: ${request.responseType}`);
        }

        // Cache the result
        await this.cache.set(cacheKey, result, 10 * 60); // 10-minute cache
      }

      const assessmentTime = Date.now() - startTime;
      result.metadata = {
        ...result.metadata,
        assessmentTime,
        cached: result.metadata?.cached || false,
      };

      return result;
    } catch (error) {
      console.error('Error assessing user response:', error);
      return this.getFallbackAssessment(request);
    }
  }

  async gradeExercise(responses: UserResponse[], exerciseContext: ExerciseContext): Promise<GradingResult> {
    try {
      // Grade individual responses
      const individualGrades = await Promise.all(
        responses.map(response => this.assessUserResponse({
          userResponse: response.answer,
          expectedAnswer: response.expected,
          responseType: response.type,
          context: exerciseContext.learningContext,
          questionContext: response.questionContext,
        }))
      );

      // Calculate overall grade and feedback
      const overallScore = this.calculateOverallScore(individualGrades);
      const categoryBreakdown = this.analyzeCategoryPerformance(individualGrades, responses);
      const personalizedFeedback = await this.generateExerciseFeedback(
        individualGrades,
        exerciseContext,
        overallScore
      );

      return {
        overallScore,
        individualGrades,
        categoryBreakdown,
        feedback: personalizedFeedback,
        timeSpent: exerciseContext.timeSpent,
        completedAt: new Date(),
        strengths: this.identifyStrengths(individualGrades),
        weaknesses: this.identifyWeaknesses(individualGrades),
        nextRecommendations: await this.generateRecommendations(categoryBreakdown, exerciseContext),
      };
    } catch (error) {
      console.error('Error grading exercise:', error);
      return this.getFallbackGrading(responses);
    }
  }

  async generatePersonalizedFeedback(
    assessment: AssessmentResult,
    learningContext: LearningContext,
    motivationLevel: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<PersonalizedFeedback> {
    try {
      const prompt = this.promptEngine.generateFeedbackPrompt({
        assessment,
        learningContext,
        motivationLevel,
        userLevel: learningContext.userLevel,
        recentPerformance: learningContext.recentPerformance,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });

      const feedbackContent = response.choices[0]?.message?.content;
      if (!feedbackContent) {
        return this.getFallbackFeedback(assessment);
      }

      const parsedFeedback = await this.parseFeedbackResponse(feedbackContent);
      return parsedFeedback;
    } catch (error) {
      console.error('Error generating personalized feedback:', error);
      return this.getFallbackFeedback(assessment);
    }
  }

  async analyzeWeaknesses(userId: number, timeframe: number = 30): Promise<WeaknessAnalysis> {
    try {
      // Get recent assessment data
      const recentAssessments = await this.getRecentAssessments(userId, timeframe);
      if (recentAssessments.length === 0) {
        return this.getDefaultWeaknessAnalysis();
      }

      // Analyze patterns in mistakes
      const mistakePatterns = this.analyzeMistakePatterns(recentAssessments);
      const skillGaps = this.identifySkillGaps(recentAssessments);
      const improvementTrends = this.calculateImprovementTrends(recentAssessments);

      // Generate AI analysis of weakness patterns
      const prompt = this.promptEngine.generateWeaknessAnalysisPrompt({
        mistakePatterns,
        skillGaps,
        improvementTrends,
        timeframe,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for analytical tasks
      });

      const analysisContent = response.choices[0]?.message?.content;
      const analysis = await this.parseWeaknessAnalysis(analysisContent);

      return {
        userId,
        timeframe,
        primaryWeaknesses: analysis.primaryWeaknesses,
        improvementAreas: analysis.improvementAreas,
        strengthAreas: analysis.strengthAreas,
        confidenceLevel: this.calculateAnalysisConfidence(recentAssessments.length),
        recommendations: analysis.recommendations,
        analyzedAt: new Date(),
        trendsData: improvementTrends,
      };
    } catch (error) {
      console.error('Error analyzing weaknesses:', error);
      return this.getDefaultWeaknessAnalysis();
    }
  }

  // Individual assessment methods
  private async assessMultipleChoice(request: AssessmentRequest): Promise<AssessmentResult> {
    const isCorrect = this.normalizeAnswer(request.userResponse) === 
                     this.normalizeAnswer(request.expectedAnswer);
    
    const feedback = isCorrect 
      ? await this.generatePositiveFeedback(request)
      : await this.generateCorrectiveFeedback(request);

    return {
      score: isCorrect ? 100 : 0,
      isCorrect,
      feedback,
      confidence: 'high' as ConfidenceLevel,
      assessmentType: 'multiple-choice',
      responseTime: request.metadata?.responseTime || 0,
      attempts: request.metadata?.attempts || 1,
    };
  }

  private async assessFillInBlank(request: AssessmentRequest): Promise<AssessmentResult> {
    const prompt = this.promptEngine.generateFillInBlankAssessmentPrompt({
      userAnswer: request.userResponse,
      expectedAnswer: request.expectedAnswer,
      context: request.questionContext,
      strictness: 'moderate',
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.2,
    });

    const assessment = await this.parseGradingResponse(response.choices[0]?.message?.content);
    return {
      score: assessment.score,
      isCorrect: assessment.score >= 80, // 80% threshold for correctness
      feedback: assessment.feedback,
      confidence: assessment.confidence,
      assessmentType: 'fill-in-blank',
      corrections: assessment.corrections,
    };
  }

  private async assessOpenEnded(request: AssessmentRequest): Promise<AssessmentResult> {
    const prompt = this.promptEngine.generateOpenEndedAssessmentPrompt({
      userResponse: request.userResponse,
      expectedElements: request.expectedAnswer,
      rubric: request.rubric,
      context: request.context,
      language: 'french',
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
    });

    const assessment = await this.parseDetailedAssessment(response.choices[0]?.message?.content);
    return {
      score: assessment.score,
      isCorrect: assessment.score >= 70, // Lower threshold for open-ended
      feedback: assessment.feedback,
      confidence: assessment.confidence,
      assessmentType: 'open-ended',
      rubricBreakdown: assessment.rubricBreakdown,
      suggestions: assessment.suggestions,
    };
  }

  private async assessPronunciation(request: AssessmentRequest): Promise<AssessmentResult> {
    // This would integrate with speech recognition service
    // For now, return placeholder implementation
    return {
      score: 75, // Placeholder
      isCorrect: true,
      feedback: {
        message: 'Pronunciation assessment requires speech integration',
        tone: 'encouraging',
        suggestions: ['Practice phoneme sounds', 'Record yourself speaking'],
      },
      confidence: 'low' as ConfidenceLevel,
      assessmentType: 'pronunciation',
    };
  }

  private async assessConversation(request: AssessmentRequest): Promise<AssessmentResult> {
    const prompt = this.promptEngine.generateConversationAssessmentPrompt({
      userMessage: request.userResponse,
      conversationContext: request.questionContext,
      targetLevel: request.context?.userLevel || 'B1',
      evaluationCriteria: ['grammar', 'vocabulary', 'naturalness', 'cultural_appropriateness'],
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.4,
    });

    const assessment = await this.parseConversationAssessment(response.choices[0]?.message?.content);
    return {
      score: assessment.score,
      isCorrect: assessment.score >= 65, // Conversational threshold
      feedback: assessment.feedback,
      confidence: assessment.confidence,
      assessmentType: 'conversation',
      skillBreakdown: assessment.skillBreakdown,
      culturalNotes: assessment.culturalNotes,
    };
  }

  // Helper methods
  private generateAssessmentCacheKey(request: AssessmentRequest): string {
    const keyData = {
      userResponse: request.userResponse.toLowerCase().trim(),
      expectedAnswer: request.expectedAnswer,
      responseType: request.responseType,
    };
    return `assessment:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }

  private normalizeAnswer(answer: string): string {
    return answer.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  private calculateOverallScore(grades: AssessmentResult[]): number {
    if (grades.length === 0) return 0;
    return Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length);
  }

  private analyzeCategoryPerformance(grades: AssessmentResult[], responses: UserResponse[]): Record<string, number> {
    const categories = {};
    grades.forEach((grade, index) => {
      const category = responses[index]?.category || 'general';
      if (!categories[category]) {
        categories[category] = { total: 0, count: 0 };
      }
      categories[category].total += grade.score;
      categories[category].count += 1;
    });

    return Object.keys(categories).reduce((result, category) => {
      result[category] = Math.round(categories[category].total / categories[category].count);
      return result;
    }, {});
  }

  private identifyStrengths(grades: AssessmentResult[]): string[] {
    // Analyze grades to identify strength areas
    return grades
      .filter(grade => grade.score >= 80)
      .map(grade => grade.assessmentType)
      .filter((type, index, arr) => arr.indexOf(type) === index);
  }

  private identifyWeaknesses(grades: AssessmentResult[]): string[] {
    // Analyze grades to identify weakness areas
    return grades
      .filter(grade => grade.score < 60)
      .map(grade => grade.assessmentType)
      .filter((type, index, arr) => arr.indexOf(type) === index);
  }

  private async generateRecommendations(
    categoryBreakdown: Record<string, number>,
    exerciseContext: ExerciseContext
  ): Promise<string[]> {
    const weakCategories = Object.entries(categoryBreakdown)
      .filter(([_, score]) => score < 70)
      .map(([category, _]) => category);

    return [
      `Focus on ${weakCategories.join(', ')} areas`,
      'Practice similar exercises daily',
      'Review related grammar rules',
    ];
  }

  // Fallback methods
  private getFallbackAssessment(request: AssessmentRequest): AssessmentResult {
    return {
      score: 50, // Neutral score
      isCorrect: false,
      feedback: {
        message: 'Assessment temporarily unavailable. Please try again.',
        tone: 'neutral',
        suggestions: ['Review the material', 'Try the exercise again'],
      },
      confidence: 'low' as ConfidenceLevel,
      assessmentType: request.responseType,
      isFallback: true,
    };
  }

  private getFallbackGrading(responses: UserResponse[]): GradingResult {
    return {
      overallScore: 50,
      individualGrades: responses.map(() => this.getFallbackAssessment({
        userResponse: '',
        expectedAnswer: '',
        responseType: 'multiple-choice',
      })),
      categoryBreakdown: { general: 50 },
      feedback: {
        message: 'Grading temporarily unavailable',
        tone: 'neutral',
        suggestions: [],
      },
      timeSpent: 0,
      completedAt: new Date(),
      strengths: [],
      weaknesses: [],
      nextRecommendations: ['Try again later'],
      isFallback: true,
    };
  }

  private getFallbackFeedback(assessment: AssessmentResult): PersonalizedFeedback {
    return {
      message: 'Keep practicing! Every attempt helps you learn.',
      tone: 'encouraging',
      suggestions: ['Review the lesson material', 'Practice similar exercises'],
      motivationalQuote: 'Learning a language is a journey, not a destination.',
      nextSteps: ['Continue with the next lesson'],
    };
  }

  // Placeholder methods for complex parsing
  private async parseGradingResponse(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      return { score: 50, feedback: 'Parsing error', confidence: 'low' };
    }
  }

  private async parseDetailedAssessment(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      return { score: 50, feedback: { message: 'Assessment error' }, confidence: 'low' };
    }
  }

  private async parseConversationAssessment(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      return { score: 50, feedback: { message: 'Conversation assessment error' }, confidence: 'low' };
    }
  }

  private async parseFeedbackResponse(content: string): Promise<PersonalizedFeedback> {
    try {
      return JSON.parse(content);
    } catch (error) {
      return this.getFallbackFeedback(null);
    }
  }

  private async parseWeaknessAnalysis(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      return {
        primaryWeaknesses: [],
        improvementAreas: [],
        strengthAreas: [],
        recommendations: [],
      };
    }
  }

  // Database interaction methods (to be implemented based on your database service)
  private async getRecentAssessments(userId: number, days: number): Promise<any[]> {
    // Implement database query for recent assessments
    return [];
  }

  private analyzeMistakePatterns(assessments: any[]): any {
    // Analyze patterns in user mistakes
    return {};
  }

  private identifySkillGaps(assessments: any[]): any {
    // Identify gaps in user skills
    return {};
  }

  private calculateImprovementTrends(assessments: any[]): any {
    // Calculate improvement trends over time
    return {};
  }

  private calculateAnalysisConfidence(dataPoints: number): ConfidenceLevel {
    if (dataPoints >= 20) return 'high';
    if (dataPoints >= 10) return 'medium';
    return 'low';
  }

  private getDefaultWeaknessAnalysis(): WeaknessAnalysis {
    return {
      userId: 0,
      timeframe: 30,
      primaryWeaknesses: [],
      improvementAreas: ['grammar', 'vocabulary'],
      strengthAreas: [],
      confidenceLevel: 'low',
      recommendations: ['Complete more exercises to build analysis data'],
      analyzedAt: new Date(),
      trendsData: {},
    };
  }

  private async generatePositiveFeedback(request: AssessmentRequest): Promise<PersonalizedFeedback> {
    return {
      message: 'Excellent work! You got that right.',
      tone: 'congratulatory',
      suggestions: ['Keep up the great work', 'Try more challenging exercises'],
    };
  }

  private async generateCorrectiveFeedback(request: AssessmentRequest): Promise<PersonalizedFeedback> {
    return {
      message: `Not quite right. The correct answer is: ${request.expectedAnswer}`,
      tone: 'encouraging',
      suggestions: ['Review the related grammar rule', 'Practice similar examples'],
    };
  }

  private async generateExerciseFeedback(
    grades: AssessmentResult[],
    context: ExerciseContext,
    overallScore: number
  ): Promise<PersonalizedFeedback> {
    let tone: 'congratulatory' | 'encouraging' | 'motivational';
    let message: string;

    if (overallScore >= 80) {
      tone = 'congratulatory';
      message = 'Excellent performance! You\'re mastering this topic.';
    } else if (overallScore >= 60) {
      tone = 'encouraging';
      message = 'Good progress! A few more practice sessions and you\'ll have this down.';
    } else {
      tone = 'motivational';
      message = 'Don\'t give up! Learning takes time and practice.';
    }

    return {
      message,
      tone,
      suggestions: [
        'Review areas where you scored below 70%',
        'Practice daily for consistent improvement',
      ],
    };
  }
}
```

#### **2. Enhanced Prompt Templates for Assessment**
```typescript
// server/src/services/promptTemplateEngine.ts (additions)

export class PromptTemplateEngine {
  // ... existing methods ...

  generateFeedbackPrompt(params: FeedbackPromptParams): string {
    return `Generate personalized learning feedback for a French language student.

STUDENT CONTEXT:
- Level: ${params.learningContext.userLevel}
- Recent Performance: ${params.learningContext.recentPerformance}
- Motivation Level: ${params.motivationLevel}
- Learning Style: ${params.learningContext.learningStyle}

ASSESSMENT RESULT:
- Score: ${params.assessment.score}/100
- Type: ${params.assessment.assessmentType}
- Correct: ${params.assessment.isCorrect}
- Previous Attempts: ${params.assessment.attempts || 1}

FEEDBACK REQUIREMENTS:
- Tone should be ${params.motivationLevel === 'low' ? 'highly encouraging' : 'supportive'}
- Provide specific, actionable suggestions
- Include motivational elements appropriate for French learners
- Keep feedback concise but meaningful
- Address specific mistakes if applicable

Return a JSON object with this structure:
{
  "message": "Main feedback message (2-3 sentences)",
  "tone": "congratulatory" | "encouraging" | "motivational",
  "suggestions": ["Specific suggestion 1", "Specific suggestion 2"],
  "motivationalQuote": "Brief inspirational quote about language learning",
  "nextSteps": ["Recommended next action"],
  "grammarTip": "Quick grammar tip if applicable",
  "culturalNote": "French cultural insight if relevant"
}`;
  }

  generateFillInBlankAssessmentPrompt(params: FillInBlankParams): string {
    return `Assess this French fill-in-the-blank response:

QUESTION CONTEXT: ${params.context}
EXPECTED ANSWER: ${params.expectedAnswer}
USER ANSWER: ${params.userAnswer}
ASSESSMENT STRICTNESS: ${params.strictness}

Evaluate the user's answer considering:
1. Grammatical correctness
2. Spelling accuracy (allow minor typos)
3. Contextual appropriateness
4. Alternative valid answers

Return a JSON object:
{
  "score": 0-100,
  "isCorrect": boolean,
  "confidence": "high" | "medium" | "low",
  "feedback": {
    "message": "Explanation of the assessment",
    "corrections": ["specific correction if needed"],
    "alternatives": ["other acceptable answers if any"]
  },
  "reasoning": "Brief explanation of the scoring"
}`;
  }

  generateOpenEndedAssessmentPrompt(params: OpenEndedParams): string {
    return `Assess this French open-ended response using the provided rubric:

USER RESPONSE: ${params.userResponse}
EXPECTED ELEMENTS: ${params.expectedElements}
RUBRIC: ${JSON.stringify(params.rubric)}
LANGUAGE: ${params.language}

Evaluate based on:
1. Content accuracy and completeness
2. Grammar and vocabulary usage
3. Cultural appropriateness
4. Communication effectiveness

Return a JSON object:
{
  "score": 0-100,
  "confidence": "high" | "medium" | "low",
  "feedback": {
    "message": "Detailed assessment explanation",
    "strengths": ["What the student did well"],
    "improvements": ["Areas for improvement"]
  },
  "rubricBreakdown": {
    "grammar": 0-100,
    "vocabulary": 0-100,
    "content": 0-100,
    "cultural": 0-100
  },
  "suggestions": ["Specific improvement suggestions"]
}`;
  }

  generateConversationAssessmentPrompt(params: ConversationParams): string {
    return `Assess this French conversation response:

USER MESSAGE: ${params.userMessage}
CONVERSATION CONTEXT: ${params.conversationContext}
TARGET LEVEL: ${params.targetLevel}
EVALUATION CRITERIA: ${params.evaluationCriteria.join(', ')}

Assess the response for:
1. Grammatical accuracy
2. Vocabulary appropriateness for level
3. Natural conversation flow
4. Cultural appropriateness
5. Communication effectiveness

Return a JSON object:
{
  "score": 0-100,
  "confidence": "high" | "medium" | "low",
  "feedback": {
    "message": "Assessment of the conversation response",
    "tone": "encouraging"
  },
  "skillBreakdown": {
    "grammar": 0-100,
    "vocabulary": 0-100,
    "naturalness": 0-100,
    "cultural": 0-100
  },
  "culturalNotes": "Cultural context and appropriateness comments",
  "suggestions": ["Conversation improvement suggestions"]
}`;
  }

  generateWeaknessAnalysisPrompt(params: WeaknessAnalysisParams): string {
    return `Analyze learning patterns and identify areas for improvement:

MISTAKE PATTERNS: ${JSON.stringify(params.mistakePatterns)}
SKILL GAPS: ${JSON.stringify(params.skillGaps)}
IMPROVEMENT TRENDS: ${JSON.stringify(params.improvementTrends)}
ANALYSIS TIMEFRAME: ${params.timeframe} days

Provide insights on:
1. Primary weakness areas that need immediate attention
2. Secondary improvement areas
3. Strength areas to build upon
4. Specific learning recommendations
5. Projected improvement timeline

Return a JSON object:
{
  "primaryWeaknesses": ["weakness area 1", "weakness area 2"],
  "improvementAreas": ["area needing work 1", "area needing work 2"],
  "strengthAreas": ["strength area 1", "strength area 2"],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "learningPlan": {
    "immediate": "Focus for next 1-2 weeks",
    "shortTerm": "Focus for next month",
    "longTerm": "Focus for next 3 months"
  },
  "confidenceNote": "Assessment confidence level explanation"
}`;
  }
}
```

#### **3. Assessment Types and Interfaces**
```typescript
// server/src/types/Assessment.ts

export interface AssessmentRequest {
  userResponse: string;
  expectedAnswer: string;
  responseType: ResponseType;
  context?: LearningContext;
  questionContext?: string;
  rubric?: AssessmentRubric;
  metadata?: {
    responseTime?: number;
    attempts?: number;
    hints?: number;
  };
}

export interface AssessmentResult {
  score: number; // 0-100
  isCorrect: boolean;
  feedback: PersonalizedFeedback;
  confidence: ConfidenceLevel;
  assessmentType: ResponseType;
  responseTime?: number;
  attempts?: number;
  corrections?: string[];
  suggestions?: string[];
  rubricBreakdown?: Record<string, number>;
  skillBreakdown?: Record<string, number>;
  culturalNotes?: string;
  metadata?: {
    assessmentTime?: number;
    cached?: boolean;
  };
  isFallback?: boolean;
}

export interface GradingResult {
  overallScore: number;
  individualGrades: AssessmentResult[];
  categoryBreakdown: Record<string, number>;
  feedback: PersonalizedFeedback;
  timeSpent: number;
  completedAt: Date;
  strengths: string[];
  weaknesses: string[];
  nextRecommendations: string[];
  isFallback?: boolean;
}

export interface PersonalizedFeedback {
  message: string;
  tone: 'congratulatory' | 'encouraging' | 'motivational' | 'neutral';
  suggestions: string[];
  motivationalQuote?: string;
  nextSteps?: string[];
  grammarTip?: string;
  culturalNote?: string;
}

export interface WeaknessAnalysis {
  userId: number;
  timeframe: number; // days
  primaryWeaknesses: string[];
  improvementAreas: string[];
  strengthAreas: string[];
  confidenceLevel: ConfidenceLevel;
  recommendations: string[];
  analyzedAt: Date;
  trendsData: any;
  learningPlan?: {
    immediate: string;
    shortTerm: string;
    longTerm: string;
  };
}

export interface UserResponse {
  answer: string;
  expected: string;
  type: ResponseType;
  category?: string;
  questionContext?: string;
}

export interface ExerciseContext {
  exerciseId: string;
  exerciseType: string;
  learningContext: LearningContext;
  timeSpent: number;
  hintsUsed: number;
}

export interface AssessmentRubric {
  criteria: RubricCriterion[];
  maxScore: number;
  passingScore: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
  weightPercentage: number;
}

export type ResponseType = 
  | 'multiple-choice' 
  | 'fill-in-blank' 
  | 'open-ended' 
  | 'pronunciation' 
  | 'conversation'
  | 'listening'
  | 'reading-comprehension';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

// Prompt parameter interfaces
export interface FeedbackPromptParams {
  assessment: AssessmentResult;
  learningContext: LearningContext;
  motivationLevel: 'low' | 'medium' | 'high';
}

export interface FillInBlankParams {
  userAnswer: string;
  expectedAnswer: string;
  context: string;
  strictness: 'strict' | 'moderate' | 'lenient';
}

export interface OpenEndedParams {
  userResponse: string;
  expectedElements: string;
  rubric: AssessmentRubric;
  context: LearningContext;
  language: string;
}

export interface ConversationParams {
  userMessage: string;
  conversationContext: string;
  targetLevel: string;
  evaluationCriteria: string[];
}

export interface WeaknessAnalysisParams {
  mistakePatterns: any;
  skillGaps: any;
  improvementTrends: any;
  timeframe: number;
}
```

## **Files to Create/Modify**

### **New Files**
```
server/src/services/
└── aiAssessmentEngine.ts       (Main assessment service)

server/src/types/
└── Assessment.ts               (Assessment-specific types)

server/src/controllers/
└── assessmentController.ts     (Assessment API endpoints)

server/src/routes/
└── assessmentRoutes.ts         (Assessment routes)
```

### **Files to Modify**
```
server/src/services/aiOrchestrator.ts     (Integrate assessment engine)
server/src/services/promptTemplateEngine.ts (Add assessment prompts)
server/src/controllers/aiController.ts    (Add assessment methods)
server/src/routes/aiRoutes.ts            (Add assessment routes)
```

## **API Endpoints**

### **Assessment Controller**
```typescript
// server/src/controllers/assessmentController.ts

import { Request, Response } from 'express';
import { AIAssessmentEngine } from '../services/aiAssessmentEngine';
import { AssessmentRequest, UserResponse } from '../types/Assessment';

export class AssessmentController {
  private assessmentEngine: AIAssessmentEngine;

  constructor(assessmentEngine: AIAssessmentEngine) {
    this.assessmentEngine = assessmentEngine;
  }

  async assessResponse(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const assessmentRequest: AssessmentRequest = req.body;
      
      // Add user context to the assessment request
      assessmentRequest.context = await this.getUserLearningContext(userId);
      
      const result = await this.assessmentEngine.assessUserResponse(assessmentRequest);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error assessing response:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async gradeExercise(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { responses, exerciseContext } = req.body;
      
      const gradingResult = await this.assessmentEngine.gradeExercise(
        responses as UserResponse[],
        exerciseContext
      );
      
      // Save grading result to database
      await this.saveGradingResult(userId, gradingResult);
      
      res.json({
        success: true,
        data: gradingResult,
      });
    } catch (error) {
      console.error('Error grading exercise:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getWeaknessAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const timeframe = parseInt(req.query.timeframe as string) || 30;
      
      const analysis = await this.assessmentEngine.analyzeWeaknesses(userId, timeframe);
      
      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      console.error('Error analyzing weaknesses:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async generateFeedback(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { assessment, motivationLevel } = req.body;
      
      const learningContext = await this.getUserLearningContext(userId);
      const feedback = await this.assessmentEngine.generatePersonalizedFeedback(
        assessment,
        learningContext,
        motivationLevel
      );
      
      res.json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      console.error('Error generating feedback:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  private async getUserLearningContext(userId: number): Promise<any> {
    // This would integrate with the orchestrator to get user context
    // Placeholder implementation
    return {
      userLevel: 'B1',
      recentPerformance: 0.75,
      learningStyle: 'visual',
    };
  }

  private async saveGradingResult(userId: number, result: any): Promise<void> {
    // Save grading result to database
    // Implementation depends on your database service
  }
}
```

### **Assessment Routes**
```typescript
// server/src/routes/assessmentRoutes.ts

import express from 'express';
import { AssessmentController } from '../controllers/assessmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Assess individual response
router.post('/assess', assessmentController.assessResponse.bind(assessmentController));

// Grade complete exercise
router.post('/grade', assessmentController.gradeExercise.bind(assessmentController));

// Get weakness analysis
router.get('/analysis/:userId', assessmentController.getWeaknessAnalysis.bind(assessmentController));

// Generate personalized feedback
router.post('/feedback', assessmentController.generateFeedback.bind(assessmentController));

// Get assessment history
router.get('/history/:userId', assessmentController.getAssessmentHistory.bind(assessmentController));

export default router;
```

## **Testing Strategy**

### **Unit Tests**
```typescript
// server/src/tests/aiAssessmentEngine.test.ts

describe('AIAssessmentEngine', () => {
  let engine: AIAssessmentEngine;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockOpenAI = createMockOpenAI();
    engine = new AIAssessmentEngine(mockOpenAI);
  });

  describe('assessUserResponse', () => {
    it('should correctly assess multiple choice responses', async () => {
      const request: AssessmentRequest = {
        userResponse: 'bonjour',
        expectedAnswer: 'bonjour',
        responseType: 'multiple-choice',
      };

      const result = await engine.assessUserResponse(request);

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
      expect(result.assessmentType).toBe('multiple-choice');
    });

    it('should handle incorrect multiple choice responses', async () => {
      const request: AssessmentRequest = {
        userResponse: 'bonsoir',
        expectedAnswer: 'bonjour',
        responseType: 'multiple-choice',
      };

      const result = await engine.assessUserResponse(request);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback).toBeDefined();
    });

    it('should assess fill-in-blank with AI evaluation', async () => {
      const request: AssessmentRequest = {
        userResponse: 'suis',
        expectedAnswer: 'suis',
        responseType: 'fill-in-blank',
        questionContext: 'Je ____ étudiant.',
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(
        createMockAssessmentResponse(85, true)
      );

      const result = await engine.assessUserResponse(request);

      expect(result.score).toBe(85);
      expect(result.isCorrect).toBe(true);
      expect(result.confidence).toBe('high');
    });

    it('should handle API errors gracefully', async () => {
      const request: AssessmentRequest = {
        userResponse: 'test',
        expectedAnswer: 'test',
        responseType: 'open-ended',
      };

      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await engine.assessUserResponse(request);

      expect(result.isFallback).toBe(true);
      expect(result.score).toBe(50);
    });
  });

  describe('gradeExercise', () => {
    it('should grade multiple responses and provide overall feedback', async () => {
      const responses: UserResponse[] = [
        { answer: 'bonjour', expected: 'bonjour', type: 'multiple-choice' },
        { answer: 'suis', expected: 'suis', type: 'fill-in-blank' },
      ];

      const context = createMockExerciseContext();

      const result = await engine.gradeExercise(responses, context);

      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.individualGrades).toHaveLength(2);
      expect(result.feedback).toBeDefined();
    });
  });

  describe('analyzeWeaknesses', () => {
    it('should analyze user weaknesses from historical data', async () => {
      const userId = 1;
      const timeframe = 30;

      // Mock database data
      jest.spyOn(engine as any, 'getRecentAssessments').mockResolvedValue([
        { score: 60, category: 'grammar', timestamp: new Date() },
        { score: 80, category: 'vocabulary', timestamp: new Date() },
      ]);

      const analysis = await engine.analyzeWeaknesses(userId, timeframe);

      expect(analysis.userId).toBe(userId);
      expect(analysis.primaryWeaknesses).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
    });
  });
});
```

## **Review Points & Solutions**

### **🔍 Review Point 1: Assessment Accuracy**
**Concern**: AI assessments might not match human grading standards
**Solution**: 
- Confidence scoring for all assessments
- Multiple validation layers for complex responses
- Fallback mechanisms for low-confidence assessments
- Regular calibration against human grading

### **🔍 Review Point 2: Response Time**
**Concern**: Assessment might be too slow for real-time feedback
**Solution**:
- Aggressive caching for similar responses
- Fast-track simple assessments (multiple-choice)
- Parallel processing for complex evaluations
- Timeout handling with graceful degradation

### **🔍 Review Point 3: French Language Accuracy**
**Concern**: AI might not handle French language nuances correctly
**Solution**:
- Specialized prompts for French grammar rules
- Cultural context awareness in assessments
- Alternative answer acceptance for regional variations
- Expert validation of assessment rubrics

### **🔍 Review Point 4: Feedback Quality**
**Concern**: Feedback might be too generic or inappropriate
**Solution**:
- Personalized feedback based on user profile
- Motivational tone adjustment based on performance
- Specific, actionable suggestions
- Cultural sensitivity in feedback messages

## **Progress Tracking**

### **Task Checklist**
- [ ] **Core Assessment Engine** (3 hours)
  - [ ] AIAssessmentEngine service implemented
  - [ ] Multiple response type handling
  - [ ] Grading algorithms implemented
  - [ ] Weakness analysis logic
- [ ] **Prompt Engineering** (1 hour)
  - [ ] Assessment prompt templates
  - [ ] Feedback generation prompts
  - [ ] Analysis prompts
  - [ ] Quality validation prompts
- [ ] **API Integration** (1 hour)
  - [ ] Assessment controller implemented
  - [ ] Routes configured
  - [ ] Error handling
  - [ ] Response formatting
- [ ] **Testing & Validation** (1 hour)
  - [ ] Unit tests implemented
  - [ ] Assessment accuracy validation
  - [ ] Performance benchmarking
  - [ ] Fallback scenario testing

### **Success Metrics**
- [ ] Assessment accuracy > 85% vs human grading
- [ ] Response time < 3 seconds for all assessment types
- [ ] Confidence scoring accuracy > 90%
- [ ] Fallback success rate 100%
- [ ] French language handling accuracy > 95%
- [ ] User satisfaction with feedback > 4.5/5

## **Next Steps**
1. Complete this implementation
2. Integration testing with Tasks 3.1.A and 3.1.B
3. Calibration against human grading standards
4. Performance optimization
5. Begin Task 3.1.D: AI-First Dashboard Implementation

---

**Status**: ⏳ Ready for Implementation  
**Dependencies**: Task 3.1.A (AI Orchestration), Task 3.1.B (Content Generation)  
**Estimated Completion**: After dependencies + 6 hours development
