/**
 * AI Content Validation Service
 * 
 * Implements comprehensive validation for AI-generated content to ensure quality,
 * accuracy, and educational value before storage in the database.
 * 
 * Key Features:
 * - Multi-layered validation (structure, content, educational value)
 * - French language-specific validation rules
 * - Confidence scoring for validation results
 * - Detailed feedback for content improvement
 * - Support for all content types in the system
 */

import { IContentValidator } from '../contentGeneration/interfaces';
import { 
  ContentRequest, 
  ContentValidation, 
  StructuredContent,
  GeneratedContent,
  ContentType,
  isLesson,
  isVocabularyDrill,
  isGrammarExercise,
  isCulturalContent,
  isPersonalizedExercise
} from '../../types/Content';

interface ValidationRule {
  name: string;
  weight: number; // Importance weight (0-1)
  check: (content: any, request: ContentRequest) => ValidationResult;
}

interface ValidationResult {
  passed: boolean;
  score: number; // 0-1
  issues: string[];
  suggestions: string[];
}

export class ContentValidator implements IContentValidator {
  private readonly validationRules: Map<ContentType, ValidationRule[]>;
  private readonly commonRules: ValidationRule[];

  constructor() {
    this.commonRules = this.initializeCommonRules();
    this.validationRules = this.initializeContentTypeRules();
  }

  /**
   * Main validation method that orchestrates all validation checks
   */
  async validate(content: any, request: ContentRequest): Promise<ContentValidation> {
    try {
      const startTime = Date.now();
      
      // ✅ ENHANCED LOGGING: Log initial validation attempt
      console.log('[CONTENT_VALIDATOR_DEBUG] Starting validation', {
        userId: request.userId,
        contentType: request.type,
        requestLevel: request.level,
        contentKeys: content && typeof content === 'object' ? Object.keys(content) : 'not_object',
        contentType_actual: typeof content
      });
      
      // Ensure content has proper structure
      if (!this.hasValidStructure(content)) {
        console.error('[CONTENT_VALIDATOR_DEBUG] Content structure validation failed', {
          userId: request.userId,
          contentType: request.type,
          contentProvided: content,
          contentType_actual: typeof content,
          contentKeys: content && typeof content === 'object' ? Object.keys(content) : 'not_object',
          requiredStructure: {
            needsType: 'type property',
            needsTitle: 'title property',
            needsDescription: 'description property',
            needsLearningObjectives: 'learningObjectives array'
          }
        });
        
        return this.createFailedValidation(
          'Invalid content structure',
          ['Content must have valid structured format']
        );
      }

      const structuredContent = content as StructuredContent;
      
      // ✅ ENHANCED LOGGING: Log structured content details
      console.log('[CONTENT_VALIDATOR_DEBUG] Content structure validated, running rules', {
        userId: request.userId,
        contentType: request.type,
        structuredContentType: structuredContent.type,
        hasTitle: !!structuredContent.title,
        titleLength: structuredContent.title?.length || 0,
        hasDescription: !!structuredContent.description,
        descriptionLength: structuredContent.description?.length || 0,
        learningObjectivesCount: structuredContent.learningObjectives?.length || 0,
        estimatedTime: structuredContent.estimatedTime,
        additionalFields: Object.keys(structuredContent).filter(key => 
          !['type', 'title', 'description', 'learningObjectives', 'estimatedTime'].includes(key)
        )
      });
      
      // Get validation rules for content type
      const typeRules = this.validationRules.get(request.type) || [];
      const allRules = [...this.commonRules, ...typeRules];

      // ✅ ENHANCED LOGGING: Log validation rules being applied
      console.log('[CONTENT_VALIDATOR_DEBUG] Validation rules to apply', {
        userId: request.userId,
        contentType: request.type,
        commonRulesCount: this.commonRules.length,
        typeSpecificRulesCount: typeRules.length,
        totalRules: allRules.length,
        ruleNames: allRules.map(rule => rule.name),
        ruleWeights: allRules.map(rule => ({ name: rule.name, weight: rule.weight }))
      });

      // Run all validation rules
      const results = allRules.map(rule => {
        const ruleStartTime = Date.now();
        const result = rule.check(structuredContent, request);
        const ruleDuration = Date.now() - ruleStartTime;
        
        // ✅ ENHANCED LOGGING: Log each rule result
        console.log('[CONTENT_VALIDATOR_DEBUG] Rule completed', {
          userId: request.userId,
          contentType: request.type,
          ruleName: rule.name,
          ruleWeight: rule.weight,
          passed: result.passed,
          score: result.score,
          issuesCount: result.issues.length,
          issues: result.issues,
          suggestionsCount: result.suggestions.length,
          suggestions: result.suggestions,
          duration: ruleDuration
        });
        
        return {
          rule,
          result
        };
      });

      // Calculate weighted score
      const totalWeight = allRules.reduce((sum, rule) => sum + rule.weight, 0);
      const weightedScore = results.reduce((sum, { rule, result }) => {
        return sum + (result.score * rule.weight);
      }, 0) / totalWeight;

      // Collect all issues and suggestions
      const allIssues = results.flatMap(({ result }) => result.issues);
      const allSuggestions = results.flatMap(({ result }) => result.suggestions);

      // Determine if content is valid (threshold: 0.7)
      const isValid = weightedScore >= 0.7 && allIssues.length === 0;

      // Calculate confidence based on validation completeness
      const confidence = this.calculateValidationConfidence(results);

      const validationTime = Date.now() - startTime;

      // ✅ ENHANCED LOGGING: Log final validation result
      console.log('[CONTENT_VALIDATOR_DEBUG] Validation completed', {
        userId: request.userId,
        contentType: request.type,
        isValid,
        weightedScore,
        scoreThreshold: 0.7,
        totalWeight,
        allIssuesCount: allIssues.length,
        allIssues,
        allSuggestionsCount: allSuggestions.length,
        allSuggestions,
        confidence,
        validationTime,
        ruleResults: results.map(({ rule, result }) => ({
          ruleName: rule.name,
          passed: result.passed,
          score: result.score,
          weight: rule.weight,
          weightedContribution: result.score * rule.weight
        }))
      });

      return {
        isValid,
        score: Math.round(weightedScore * 100) / 100, // Round to 2 decimal places
        issues: allIssues,
        suggestions: allSuggestions,
        confidence
      };

    } catch (error) {
      console.error('[CONTENT_VALIDATOR_DEBUG] Validation exception occurred', {
        userId: request.userId,
        contentType: request.type,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        contentProvided: content
      });
      
      return this.createFailedValidation(
        'Validation error occurred',
        ['Internal validation error - content needs manual review']
      );
    }
  }

  /**
   * Initialize common validation rules that apply to all content types
   */
  private initializeCommonRules(): ValidationRule[] {
    return [
      {
        name: 'has_required_fields',
        weight: 0.2,
        check: (content: StructuredContent) => {
          const issues: string[] = [];
          const suggestions: string[] = [];

          if (!content.title || content.title.trim().length === 0) {
            issues.push('Missing or empty title');
            suggestions.push('Add a descriptive title');
          }

          if (!content.description || content.description.trim().length === 0) {
            issues.push('Missing or empty description');
            suggestions.push('Add a clear description');
          }

          if (!content.learningObjectives || content.learningObjectives.length === 0) {
            issues.push('Missing learning objectives');
            suggestions.push('Define clear learning objectives');
          }

          if (!content.estimatedTime || content.estimatedTime <= 0) {
            issues.push('Invalid estimated time');
            suggestions.push('Set realistic estimated completion time');
          }

          const score = issues.length === 0 ? 1.0 : Math.max(0, 1 - (issues.length * 0.25));

          return {
            passed: issues.length === 0,
            score,
            issues,
            suggestions
          };
        }
      },
      {
        name: 'french_language_quality',
        weight: 0.3,
        check: (content: StructuredContent) => {
          const issues: string[] = [];
          const suggestions: string[] = [];
          let textToCheck = '';

          // Extract text content for French validation
          textToCheck = this.extractTextContent(content);

          // Basic French validation checks
          const frenchValidation = this.validateFrenchContent(textToCheck);
          issues.push(...frenchValidation.issues);
          suggestions.push(...frenchValidation.suggestions);

          return {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.1)),
            issues,
            suggestions
          };
        }
      },
      {
        name: 'educational_value',
        weight: 0.25,
        check: (content: StructuredContent, request: ContentRequest) => {
          const issues: string[] = [];
          const suggestions: string[] = [];

          // Check if content matches requested level
          if (request.level && !this.isAppropriateForLevel(content, request.level)) {
            issues.push(`Content difficulty doesn't match requested level: ${request.level}`);
            suggestions.push('Adjust vocabulary and grammar complexity to match level');
          }

          // Check if learning objectives are specific and measurable
          if (content.learningObjectives.some(obj => this.isVagueLearningObjective(obj))) {
            issues.push('Some learning objectives are too vague');
            suggestions.push('Make learning objectives more specific and measurable');
          }

          // Check estimated time reasonableness
          if (content.estimatedTime < 5 || content.estimatedTime > 60) {
            issues.push('Unrealistic estimated completion time');
            suggestions.push('Set estimated time between 5-60 minutes');
          }

          return {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.2)),
            issues,
            suggestions
          };
        }
      },
      {
        name: 'content_completeness',
        weight: 0.15,
        check: (content: StructuredContent) => {
          const issues: string[] = [];
          const suggestions: string[] = [];

          const completeness = this.assessContentCompleteness(content);
          if (completeness < 0.8) {
            issues.push('Content appears incomplete or too brief');
            suggestions.push('Expand content sections to provide more comprehensive learning material');
          }

          return {
            passed: completeness >= 0.8,
            score: completeness,
            issues,
            suggestions
          };
        }
      },
      {
        name: 'safety_and_appropriateness',
        weight: 0.1,
        check: (content: StructuredContent) => {
          const issues: string[] = [];
          const suggestions: string[] = [];

          const textContent = this.extractTextContent(content);
          const safetyCheck = this.checkContentSafety(textContent);
          
          if (!safetyCheck.isSafe) {
            issues.push('Content may contain inappropriate material');
            suggestions.push('Review and remove any inappropriate content');
          }

          return {
            passed: safetyCheck.isSafe,
            score: safetyCheck.isSafe ? 1.0 : 0.0,
            issues,
            suggestions
          };
        }
      }
    ];
  }

  /**
   * Initialize content-type-specific validation rules
   */
  private initializeContentTypeRules(): Map<ContentType, ValidationRule[]> {
    const rules = new Map<ContentType, ValidationRule[]>();

    // Lesson-specific rules
    rules.set('lesson', [
      {
        name: 'lesson_structure',
        weight: 0.3,
        check: (content: StructuredContent) => {
          console.log('[CONTENT_VALIDATOR_DEBUG] Checking lesson structure', {
            contentType: content.type,
            isLessonTypeCheck: content.type === 'lesson',
            hasIsLesson: isLesson(content),
            availableFields: Object.keys(content)
          });

          if (!isLesson(content)) {
            console.error('[CONTENT_VALIDATOR_DEBUG] isLesson() check failed', {
              contentType: content.type,
              contentStructure: Object.keys(content),
              sections: 'sections' in content && (content as any).sections ? {
                exists: true,
                type: typeof (content as any).sections,
                isArray: Array.isArray((content as any).sections),
                length: Array.isArray((content as any).sections) ? (content as any).sections.length : 'not_array'
              } : { exists: false },
              vocabulary: 'vocabulary' in content && (content as any).vocabulary ? {
                exists: true,
                type: typeof (content as any).vocabulary,
                isArray: Array.isArray((content as any).vocabulary),
                length: Array.isArray((content as any).vocabulary) ? (content as any).vocabulary.length : 'not_array'
              } : { exists: false }
            });
            return { passed: false, score: 0, issues: ['Invalid lesson structure - isLesson() check failed'], suggestions: ['Ensure content has proper lesson structure with sections and vocabulary arrays'] };
          }

          const issues: string[] = [];
          const suggestions: string[] = [];

          // Enhanced sections checking with detailed logging - use type-safe access
          const lessonContent = content; // Already verified as lesson by isLesson check above
          if (!lessonContent.sections || lessonContent.sections.length === 0) {
            console.warn('[CONTENT_VALIDATOR_DEBUG] Lesson sections missing or empty', {
              hasSections: 'sections' in lessonContent,
              sectionsValue: lessonContent.sections,
              sectionsType: typeof lessonContent.sections,
              isArray: Array.isArray(lessonContent.sections)
            });
            issues.push('Lesson must have sections');
            suggestions.push('Add lesson sections (introduction, presentation, practice, wrap-up)');
          } else {
            // Check for recommended section types
            const sectionTypes = lessonContent.sections.map(s => s.type);
            const recommendedTypes: ('introduction' | 'presentation' | 'practice')[] = ['introduction', 'presentation', 'practice'];
            const missingSections = recommendedTypes.filter(type => !sectionTypes.includes(type));
            
            console.log('[CONTENT_VALIDATOR_DEBUG] Lesson sections analysis', {
              sectionsCount: lessonContent.sections.length,
              sectionTypes,
              recommendedTypes,
              missingSections,
              sectionsDetails: lessonContent.sections.map(s => ({
                type: s.type,
                hasTitle: !!s.title,
                hasContent: !!s.content,
                contentLength: s.content?.length || 0
              }))
            });
            
            if (missingSections.length > 0) {
              issues.push(`Missing recommended sections: ${missingSections.join(', ')}`);
              suggestions.push('Consider adding missing lesson sections for better structure');
            }
          }

          // Enhanced vocabulary checking with detailed logging - use type-safe access
          if (!lessonContent.vocabulary || lessonContent.vocabulary.length === 0) {
            console.warn('[CONTENT_VALIDATOR_DEBUG] Lesson vocabulary missing or empty', {
              hasVocabulary: 'vocabulary' in lessonContent,
              vocabularyValue: lessonContent.vocabulary,
              vocabularyType: typeof lessonContent.vocabulary,
              isArray: Array.isArray(lessonContent.vocabulary)
            });
            issues.push('Lesson should include vocabulary items');
            suggestions.push('Add relevant vocabulary items for the lesson');
          } else {
            console.log('[CONTENT_VALIDATOR_DEBUG] Lesson vocabulary analysis', {
              vocabularyCount: lessonContent.vocabulary.length,
              vocabularyItems: lessonContent.vocabulary.map(v => ({
                hasWord: !!v.word,
                hasDefinition: !!v.definition,
                hasExamples: Array.isArray(v.examples) && v.examples.length > 0,
                examplesCount: Array.isArray(v.examples) ? v.examples.length : 0
              }))
            });
          }

          const finalResult = {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.25)),
            issues,
            suggestions
          };

          console.log('[CONTENT_VALIDATOR_DEBUG] Lesson structure validation result', finalResult);
          return finalResult;
        }
      }
    ]);

    // Grammar exercise rules
    rules.set('grammar_exercise', [
      {
        name: 'grammar_structure',
        weight: 0.4,
        check: (content: StructuredContent) => {
          if (!isGrammarExercise(content)) {
            return { passed: false, score: 0, issues: ['Invalid grammar exercise structure'], suggestions: [] };
          }

          const issues: string[] = [];
          const suggestions: string[] = [];

          if (!content.grammarRule || content.grammarRule.trim().length === 0) {
            issues.push('Missing grammar rule specification');
            suggestions.push('Clearly specify the grammar rule being taught');
          }

          if (!content.explanation || content.explanation.trim().length === 0) {
            issues.push('Missing grammar rule explanation');
            suggestions.push('Provide clear explanation of the grammar rule');
          }

          if (!content.examples || content.examples.length < 2) {
            issues.push('Insufficient examples for grammar rule');
            suggestions.push('Include at least 2-3 examples demonstrating the rule');
          }

          if (!content.exercises || content.exercises.length === 0) {
            issues.push('No practice exercises provided');
            suggestions.push('Add practice exercises to reinforce the grammar rule');
          }

          return {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.2)),
            issues,
            suggestions
          };
        }
      }
    ]);

    // Vocabulary drill rules
    rules.set('vocabulary_drill', [
      {
        name: 'vocabulary_quality',
        weight: 0.4,
        check: (content: StructuredContent) => {
          if (!isVocabularyDrill(content)) {
            return { passed: false, score: 0, issues: ['Invalid vocabulary drill structure'], suggestions: [] };
          }

          const issues: string[] = [];
          const suggestions: string[] = [];

          if (!content.vocabulary || content.vocabulary.length < 5) {
            issues.push('Insufficient vocabulary items (minimum 5 required)');
            suggestions.push('Add more vocabulary items for effective practice');
          }

          // Check vocabulary item completeness
          const incompleteItems = content.vocabulary.filter(item => 
            !item.word || !item.definition || !item.examples || item.examples.length === 0
          );

          if (incompleteItems.length > 0) {
            issues.push(`${incompleteItems.length} vocabulary items are incomplete`);
            suggestions.push('Ensure all vocabulary items have word, definition, and examples');
          }

          return {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.3)),
            issues,
            suggestions
          };
        }
      }
    ]);

    // Cultural content rules
    rules.set('cultural_content', [
      {
        name: 'cultural_authenticity',
        weight: 0.3,
        check: (content: StructuredContent) => {
          if (!isCulturalContent(content)) {
            return { passed: false, score: 0, issues: ['Invalid cultural content structure'], suggestions: [] };
          }

          const issues: string[] = [];
          const suggestions: string[] = [];

          if (!content.topic || content.topic.trim().length === 0) {
            issues.push('Missing cultural topic specification');
            suggestions.push('Clearly specify the cultural topic being explored');
          }

          if (!content.keyPoints || content.keyPoints.length < 3) {
            issues.push('Insufficient key cultural points (minimum 3 required)');
            suggestions.push('Include more key cultural insights and points');
          }

          if (!content.discussionQuestions || content.discussionQuestions.length === 0) {
            issues.push('Missing discussion questions');
            suggestions.push('Add thought-provoking discussion questions');
          }

          return {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.25)),
            issues,
            suggestions
          };
        }
      }
    ]);

    // Personalized exercise rules
    rules.set('personalized_exercise', [
      {
        name: 'personalization_quality',
        weight: 0.3,
        check: (content: StructuredContent, request: ContentRequest) => {
          if (!isPersonalizedExercise(content)) {
            return { passed: false, score: 0, issues: ['Invalid personalized exercise structure'], suggestions: [] };
          }

          const issues: string[] = [];
          const suggestions: string[] = [];

          if (!content.focusAreas || content.focusAreas.length === 0) {
            issues.push('Missing focus areas for personalization');
            suggestions.push('Specify focus areas based on user needs');
          }

          // Check if focus areas match request
          if (request.focusAreas && request.focusAreas.length > 0) {
            const matchingAreas = content.focusAreas.filter(area => 
              request.focusAreas!.includes(area)
            );
            if (matchingAreas.length === 0) {
              issues.push('Focus areas do not match user requirements');
              suggestions.push('Align focus areas with user-specified requirements');
            }
          }

          if (!content.exercises || content.exercises.length === 0) {
            issues.push('No personalized exercises provided');
            suggestions.push('Add exercises tailored to the user\'s focus areas');
          }

          return {
            passed: issues.length === 0,
            score: Math.max(0, 1 - (issues.length * 0.3)),
            issues,
            suggestions
          };
        }
      }
    ]);

    return rules;
  }

  /**
   * Helper methods for validation checks
   */
  private hasValidStructure(content: any): content is StructuredContent {
    return content && 
           typeof content === 'object' && 
           content.type && 
           content.title && 
           content.description &&
           Array.isArray(content.learningObjectives);
  }

  private extractTextContent(content: StructuredContent): string {
    let text = `${content.title} ${content.description} ${content.learningObjectives.join(' ')}`;
    
    // Add type-specific text extraction with proper type guards
    if (isLesson(content)) {
      // Now content is properly typed as IStructuredLesson
      if (content.sections && Array.isArray(content.sections)) {
        text += content.sections.map(s => `${s.title || ''} ${s.content || ''}`).join(' ');
      }
      if (content.vocabulary && Array.isArray(content.vocabulary)) {
        text += content.vocabulary.map(v => `${v.word || ''} ${v.definition || ''} ${Array.isArray(v.examples) ? v.examples.join(' ') : ''}`).join(' ');
      }
    } else if (isVocabularyDrill(content)) {
      // Handle vocabulary drill specific content
      if (content.vocabulary && Array.isArray(content.vocabulary)) {
        text += content.vocabulary.map(v => `${v.word || ''} ${v.definition || ''} ${Array.isArray(v.examples) ? v.examples.join(' ') : ''}`).join(' ');
      }
    } else if (isCulturalContent(content)) {
      // Handle cultural content specific content
      if (content.vocabulary && Array.isArray(content.vocabulary)) {
        text += content.vocabulary.map(v => `${v.word || ''} ${v.definition || ''} ${Array.isArray(v.examples) ? v.examples.join(' ') : ''}`).join(' ');
      }
      if (content.keyPoints && Array.isArray(content.keyPoints)) {
        text += content.keyPoints.join(' ');
      }
    }
    
    return text;
  }

  private validateFrenchContent(text: string): { issues: string[], suggestions: string[] } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Basic French validation (simplified for this implementation)
    const commonFrenchPatterns = [
      /\b(le|la|les|un|une|des)\b/i,  // Articles
      /\b(je|tu|il|elle|nous|vous|ils|elles)\b/i,  // Pronouns
      /\b(est|sont|avoir|être)\b/i     // Common verbs
    ];

    const hasFrenchContent = commonFrenchPatterns.some(pattern => pattern.test(text));
    
    if (!hasFrenchContent && text.length > 50) {
      issues.push('Content may not contain sufficient French language elements');
      suggestions.push('Ensure content includes appropriate French vocabulary and phrases');
    }

    return { issues, suggestions };
  }

  private isAppropriateForLevel(content: StructuredContent, level: string): boolean {
    // Simplified level appropriateness check
    const textContent = this.extractTextContent(content);
    const wordCount = textContent.split(/\s+/).length;
    
    // Basic heuristics for level appropriateness
    switch (level.toUpperCase()) {
      case 'A1':
        return wordCount <= 200 && content.estimatedTime <= 15;
      case 'A2':
        return wordCount <= 400 && content.estimatedTime <= 25;
      case 'B1':
        return wordCount <= 600 && content.estimatedTime <= 35;
      case 'B2':
        return wordCount <= 800 && content.estimatedTime <= 45;
      default:
        return true;
    }
  }

  private isVagueLearningObjective(objective: string): boolean {
    const vagueWords = ['understand', 'know', 'learn', 'study', 'familiarize'];
    return vagueWords.some(word => objective.toLowerCase().includes(word));
  }

  private assessContentCompleteness(content: StructuredContent): number {
    let completenessScore = 0;
    let totalChecks = 0;

    // Check title completeness
    totalChecks++;
    if (content.title && content.title.length >= 5) completenessScore++;

    // Check description completeness
    totalChecks++;
    if (content.description && content.description.length >= 20) completenessScore++;

    // Check learning objectives
    totalChecks++;
    if (content.learningObjectives && content.learningObjectives.length >= 2) completenessScore++;

    // Type-specific completeness checks
    if (isLesson(content)) {
      totalChecks++;
      if (content.sections && content.sections.length >= 2) completenessScore++;
      
      totalChecks++;
      if (content.vocabulary && content.vocabulary.length >= 3) completenessScore++;
    }

    return totalChecks > 0 ? completenessScore / totalChecks : 0;
  }

  private checkContentSafety(text: string): { isSafe: boolean } {
    // Basic safety check - in production, this would use more sophisticated filtering
    const inappropriatePatterns = [
      /violence|violent/i,
      /hate|hatred/i,
      /inappropriate|explicit/i
    ];

    const isSafe = !inappropriatePatterns.some(pattern => pattern.test(text));
    return { isSafe };
  }

  private calculateValidationConfidence(results: Array<{ rule: ValidationRule, result: ValidationResult }>): number {
    // Calculate confidence based on how many rules passed with high scores
    const highScoreResults = results.filter(({ result }) => result.score >= 0.8);
    const confidence = highScoreResults.length / results.length;
    
    // Round to 2 decimal places
    return Math.round(confidence * 100) / 100;
  }

  private createFailedValidation(message: string, issues: string[]): ContentValidation {
    return {
      isValid: false,
      score: 0,
      issues: [message, ...issues],
      suggestions: ['Review content structure and requirements'],
      confidence: 0
    };
  }
}
