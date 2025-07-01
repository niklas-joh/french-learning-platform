# Task 3.1.B: Dynamic Content Generation

## **Task Information**
- **Task ID**: 3.1.B
- **Estimated Time**: 6 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.A (AI Orchestration Service)
- **Assignee**: [To be assigned]
- **Status**: ⏳ Not Started

## **Objective**
Implement an intelligent content generation system that creates personalized French learning materials in real-time. The system should generate lessons, exercises, vocabulary drills, grammar explanations, and cultural content tailored to each user's level, interests, and learning patterns.

## **Success Criteria**
- [ ] Generate personalized lessons based on user profile and progress
- [ ] Create vocabulary exercises with context-appropriate examples
- [ ] Generate grammar explanations with relevant practice exercises
- [ ] Produce cultural content that enhances language learning
- [ ] Ensure content quality and educational accuracy
- [ ] Support multiple content types and formats
- [ ] Validate generated content before delivery
- [ ] Content generation response time < 3 seconds
- [ ] Generated content rated >4.0/5 by users
- [ ] 90% content accuracy for language rules

## **Implementation Details**

### **Core Architecture**

#### **1. Dynamic Content Generator Service**
```typescript
// server/src/services/dynamicContentGenerator.ts

import { AIOrchestrator } from './aiOrchestrator';
import { 
  ContentRequest,
  ContentType,
  GeneratedContent,
  ContentValidation,
  UserProfile,
  LearningContext,
  ContentTemplate
} from '../types/Content';
import { PromptTemplateEngine } from './promptTemplateEngine';
import { ContentValidator } from './contentValidator';
import { ContentEnhancer } from './contentEnhancer';

export class DynamicContentGenerator {
  private aiOrchestrator: AIOrchestrator;
  private promptEngine: PromptTemplateEngine;
  private validator: ContentValidator;
  private enhancer: ContentEnhancer;

  constructor(aiOrchestrator: AIOrchestrator) {
    this.aiOrchestrator = aiOrchestrator;
    this.promptEngine = new PromptTemplateEngine();
    this.validator = new ContentValidator();
    this.enhancer = new ContentEnhancer();
  }

  async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    try {
      // Get user learning context
      const learningContext = await this.getLearningContext(request.userId);
      
      // Select appropriate content template
      const template = await this.selectContentTemplate(request.type, learningContext);
      
      // Generate content using AI
      const rawContent = await this.generateRawContent(request, template, learningContext);
      
      // Validate content quality and accuracy
      const validation = await this.validator.validateContent(rawContent, request);
      
      if (!validation.isValid) {
        // Regenerate with adjustments if validation fails
        const adjustedRequest = this.adjustRequestFromValidation(request, validation);
        return this.generateContent(adjustedRequest);
      }

      // Enhance content with multimedia, examples, and formatting
      const enhancedContent = await this.enhancer.enhanceContent(rawContent, learningContext);
      
      // Structure final content
      const finalContent = await this.structureContent(enhancedContent, request);
      
      return {
        id: this.generateContentId(),
        type: request.type,
        content: finalContent,
        metadata: {
          userId: request.userId,
          generatedAt: new Date(),
          level: learningContext.currentLevel,
          topics: request.topics || [],
          aiGenerated: true,
          version: '1.0',
        },
        validation,
        estimatedCompletionTime: this.estimateCompletionTime(finalContent),
        learningObjectives: this.extractLearningObjectives(finalContent),
      };
    } catch (error) {
      console.error('Error generating content:', error);
      return this.getFallbackContent(request);
    }
  }

  async generateLesson(
    userId: number,
    topic: string,
    level: string,
    options: any = {}
  ): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'lesson',
      topics: [topic],
      level,
      duration: options.duration || 15,
      focusAreas: options.focusAreas || [],
      learningStyle: options.learningStyle || 'mixed',
      includeExercises: true,
      includeCulturalContext: true,
    };

    return this.generateContent(request);
  }

  async generateVocabularyDrill(
    userId: number,
    vocabularySet: string[],
    context: string
  ): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'vocabulary_drill',
      vocabulary: vocabularySet,
      context,
      includeAudio: true,
      includeExamples: true,
      difficulty: 'adaptive',
    };

    return this.generateContent(request);
  }

  async generateGrammarExercise(
    userId: number,
    grammarRule: string,
    difficulty: string
  ): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'grammar_exercise',
      grammarFocus: grammarRule,
      difficulty,
      includeExplanation: true,
      includeExamples: true,
      exerciseCount: 8,
    };

    return this.generateContent(request);
  }

  async generateCulturalContent(
    userId: number,
    culturalTopic: string,
    languageLevel: string
  ): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'cultural_content',
      culturalTopic,
      level: languageLevel,
      includeVocabulary: true,
      includeDiscussion: true,
      includeMultimedia: true,
    };

    return this.generateContent(request);
  }

  async generatePersonalizedExercise(
    userId: number,
    weakAreas: string[],
    timeAvailable: number
  ): Promise<GeneratedContent> {
    const learningContext = await this.getLearningContext(userId);
    
    const request: ContentRequest = {
      userId,
      type: 'personalized_exercise',
      focusAreas: weakAreas,
      duration: timeAvailable,
      adaptToWeaknesses: true,
      reinforcePreviousLearning: true,
      level: learningContext.currentLevel,
    };

    return this.generateContent(request);
  }

  // Core generation methods
  private async generateRawContent(
    request: ContentRequest,
    template: ContentTemplate,
    context: LearningContext
  ): Promise<any> {
    const prompt = await this.promptEngine.generateContentPrompt({
      request,
      template,
      context,
    });

    const aiResponse = await this.aiOrchestrator.generateContent(
      request.userId,
      request.type,
      {
        prompt,
        maxTokens: this.getMaxTokensForType(request.type),
        temperature: this.getTemperatureForType(request.type),
      }
    );

    if (!aiResponse.success) {
      throw new Error('Failed to generate content via AI');
    }

    return aiResponse.data;
  }

  private async selectContentTemplate(
    type: ContentType,
    context: LearningContext
  ): Promise<ContentTemplate> {
    const templates = {
      lesson: this.getLessonTemplate(context),
      vocabulary_drill: this.getVocabularyTemplate(context),
      grammar_exercise: this.getGrammarTemplate(context),
      cultural_content: this.getCulturalTemplate(context),
      personalized_exercise: this.getPersonalizedTemplate(context),
    };

    return templates[type] || templates.lesson;
  }

  private getLessonTemplate(context: LearningContext): ContentTemplate {
    return {
      structure: {
        introduction: 'Hook and learning objectives',
        presentation: 'New content with examples',
        practice: 'Guided practice activities',
        production: 'Independent practice',
        wrap_up: 'Summary and next steps',
      },
      requirements: {
        vocabulary: `5-8 new words at ${context.currentLevel} level`,
        grammar: 'One main grammar point',
        culture: 'French cultural context',
        exercises: '3-4 practice activities',
        time: '15-20 minutes',
      },
      adaptations: {
        visual: 'Include visual aids and diagrams',
        auditory: 'Include pronunciation guides',
        kinesthetic: 'Include interactive elements',
      },
    };
  }

  private getVocabularyTemplate(context: LearningContext): ContentTemplate {
    return {
      structure: {
        introduction: 'Context setting for vocabulary',
        presentation: 'New vocabulary with definitions',
        examples: 'Usage examples in context',
        practice: 'Various practice activities',
        assessment: 'Quick comprehension check',
      },
      requirements: {
        words: '8-12 vocabulary items',
        contexts: 'Real-life usage scenarios',
        pronunciation: 'Phonetic guides',
        cognates: 'Connection to English when relevant',
        images: 'Visual associations',
      },
    };
  }

  private getGrammarTemplate(context: LearningContext): ContentTemplate {
    return {
      structure: {
        rule_explanation: 'Clear grammar rule explanation',
        examples: 'Multiple examples with annotations',
        guided_practice: 'Step-by-step practice',
        independent_practice: 'Varied exercise types',
        real_world_application: 'Authentic usage scenarios',
      },
      requirements: {
        clarity: 'Simple, jargon-free explanations',
        examples: '6-8 varied examples',
        exercises: '10-15 practice items',
        progression: 'Easy to complex difficulty',
        context: 'Meaningful, relevant contexts',
      },
    };
  }

  // Content enhancement and validation
  private async structureContent(
    content: any,
    request: ContentRequest
  ): Promise<any> {
    switch (request.type) {
      case 'lesson':
        return this.structureLesson(content);
      case 'vocabulary_drill':
        return this.structureVocabulary(content);
      case 'grammar_exercise':
        return this.structureGrammar(content);
      case 'cultural_content':
        return this.structureCultural(content);
      default:
        return content;
    }
  }

  private structureLesson(content: any): any {
    return {
      title: content.title,
      description: content.description,
      learningObjectives: content.objectives || [],
      estimatedTime: content.estimatedTime || 15,
      sections: [
        {
          type: 'introduction',
          title: 'Introduction',
          content: content.introduction,
          duration: 2,
        },
        {
          type: 'presentation',
          title: 'New Content',
          content: content.presentation,
          vocabulary: content.vocabulary || [],
          grammar: content.grammar,
          duration: 5,
        },
        {
          type: 'practice',
          title: 'Practice',
          exercises: content.exercises || [],
          duration: 6,
        },
        {
          type: 'wrap_up',
          title: 'Summary',
          content: content.summary,
          nextSteps: content.nextSteps,
          duration: 2,
        },
      ],
      culturalNotes: content.culturalNotes || [],
      vocabulary: content.vocabulary || [],
      grammar: content.grammar,
    };
  }

  private structureVocabulary(content: any): any {
    return {
      title: content.title,
      description: content.description,
      context: content.context,
      vocabulary: content.vocabulary.map((item: any) => ({
        word: item.word,
        definition: item.definition,
        pronunciation: item.pronunciation,
        examples: item.examples || [],
        image: item.image,
        difficulty: item.difficulty || 'medium',
      })),
      exercises: content.exercises || [],
      culturalContext: content.culturalContext,
    };
  }

  private structureGrammar(content: any): any {
    return {
      title: content.title,
      grammarRule: content.rule,
      explanation: content.explanation,
      examples: content.examples || [],
      exercises: content.exercises.map((ex: any) => ({
        type: ex.type,
        instruction: ex.instruction,
        items: ex.items || [],
        feedback: ex.feedback,
      })),
      tips: content.tips || [],
      commonMistakes: content.commonMistakes || [],
    };
  }

  private structureCultural(content: any): any {
    return {
      title: content.title,
      topic: content.topic,
      description: content.description,
      keyPoints: content.keyPoints || [],
      vocabulary: content.vocabulary || [],
      discussionQuestions: content.discussionQuestions || [],
      multimedia: content.multimedia || [],
      connections: content.connections || [],
    };
  }

  // Helper methods
  private async getLearningContext(userId: number): Promise<LearningContext> {
    // This would fetch from user service/database
    return {
      userId,
      currentLevel: 'A2',
      learningStyle: 'visual',
      weakAreas: ['pronunciation', 'verb_conjugation'],
      strengths: ['vocabulary', 'reading'],
      interests: ['travel', 'cuisine'],
      recentTopics: ['family', 'hobbies'],
      performanceHistory: [],
    };
  }

  private getMaxTokensForType(type: ContentType): number {
    const tokens = {
      lesson: 2000,
      vocabulary_drill: 1200,
      grammar_exercise: 1500,
      cultural_content: 1800,
      personalized_exercise: 1000,
    };
    return tokens[type] || 1500;
  }

  private getTemperatureForType(type: ContentType): number {
    const temperatures = {
      lesson: 0.7,
      vocabulary_drill: 0.6,
      grammar_exercise: 0.4, // More precise for grammar
      cultural_content: 0.8,
      personalized_exercise: 0.7,
    };
    return temperatures[type] || 0.7;
  }

  private generateContentId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private estimateCompletionTime(content: any): number {
    // Estimate based on content type and amount
    const wordCount = JSON.stringify(content).split(' ').length;
    const baseTime = Math.max(5, Math.floor(wordCount / 100)); // 1 minute per 100 words, min 5 minutes
    return baseTime;
  }

  private extractLearningObjectives(content: any): string[] {
    // Extract or infer learning objectives from content
    return content.learningObjectives || content.objectives || [
      'Practice French language skills',
      'Learn new vocabulary',
      'Improve comprehension',
    ];
  }

  private adjustRequestFromValidation(
    request: ContentRequest,
    validation: ContentValidation
  ): ContentRequest {
    const adjusted = { ...request };
    
    if (validation.issues.includes('too_difficult')) {
      adjusted.level = this.getLowerLevel(request.level);
    }
    
    if (validation.issues.includes('too_simple')) {
      adjusted.level = this.getHigherLevel(request.level);
    }
    
    if (validation.issues.includes('insufficient_examples')) {
      adjusted.includeMoreExamples = true;
    }

    return adjusted;
  }

  private getLowerLevel(level: string): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    return currentIndex > 0 ? levels[currentIndex - 1] : level;
  }

  private getHigherLevel(level: string): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : level;
  }

  private getFallbackContent(request: ContentRequest): GeneratedContent {
    const fallbackContent = {
      lesson: {
        title: 'Basic French Practice',
        description: 'Continue your French learning journey',
        sections: [
          {
            type: 'vocabulary',
            content: 'Practice common French words and phrases',
          },
        ],
      },
      vocabulary_drill: {
        title: 'Vocabulary Practice',
        vocabulary: [
          { word: 'bonjour', definition: 'hello', pronunciation: 'bon-ZHOOR' },
          { word: 'merci', definition: 'thank you', pronunciation: 'mer-SEE' },
        ],
      },
    };

    const content = fallbackContent[request.type] || fallbackContent.lesson;

    return {
      id: this.generateContentId(),
      type: request.type,
      content,
      metadata: {
        userId: request.userId,
        generatedAt: new Date(),
        level: request.level || 'A1',
        topics: request.topics || [],
        aiGenerated: false,
        version: '1.0',
        fallback: true,
      },
      validation: { isValid: true, score: 0.6, issues: [] },
      estimatedCompletionTime: 10,
      learningObjectives: ['Practice French basics'],
    };
  }
}
```

#### **2. Content Validator Service**
```typescript
// server/src/services/contentValidator.ts

import { ContentValidation } from '../types/Content';

export class ContentValidator {
  async validateContent(content: any, request: any): Promise<ContentValidation> {
    const validation: ContentValidation = {
      isValid: true,
      score: 1.0,
      issues: [],
      suggestions: [],
    };

    // Validate content structure
    const structureValidation = this.validateStructure(content, request.type);
    if (!structureValidation.isValid) {
      validation.isValid = false;
      validation.issues.push(...structureValidation.issues);
    }

    // Validate language level appropriateness
    const levelValidation = this.validateLevel(content, request.level);
    validation.score *= levelValidation.score;
    if (levelValidation.issues.length > 0) {
      validation.issues.push(...levelValidation.issues);
    }

    // Validate educational quality
    const qualityValidation = this.validateQuality(content, request.type);
    validation.score *= qualityValidation.score;
    if (qualityValidation.issues.length > 0) {
      validation.issues.push(...qualityValidation.issues);
    }

    // Validate French language accuracy
    const languageValidation = await this.validateLanguageAccuracy(content);
    validation.score *= languageValidation.score;
    if (languageValidation.issues.length > 0) {
      validation.issues.push(...languageValidation.issues);
    }

    // Set overall validity based on score threshold
    validation.isValid = validation.score >= 0.7;

    return validation;
  }

  private validateStructure(content: any, type: string): any {
    const requiredFields = {
      lesson: ['title', 'sections', 'vocabulary'],
      vocabulary_drill: ['vocabulary', 'context'],
      grammar_exercise: ['rule', 'examples', 'exercises'],
      cultural_content: ['topic', 'keyPoints'],
    };

    const required = requiredFields[type] || [];
    const missing = required.filter(field => !content[field]);

    return {
      isValid: missing.length === 0,
      issues: missing.map(field => `missing_${field}`),
    };
  }

  private validateLevel(content: any, targetLevel: string): any {
    const score = this.calculateLevelAppropriatenesScore(content, targetLevel);
    const issues = [];

    if (score < 0.6) {
      if (this.isTooAdvanced(content, targetLevel)) {
        issues.push('too_difficult');
      } else {
        issues.push('too_simple');
      }
    }

    return { score, issues };
  }

  private validateQuality(content: any, type: string): any {
    let score = 1.0;
    const issues = [];

    // Check for sufficient examples
    const exampleCount = this.countExamples(content);
    const minExamples = this.getMinExamples(type);
    
    if (exampleCount < minExamples) {
      score *= 0.7;
      issues.push('insufficient_examples');
    }

    // Check for clear explanations
    if (!this.hasCllearExplanations(content)) {
      score *= 0.8;
      issues.push('unclear_explanations');
    }

    // Check for engagement elements
    if (!this.hasEngagementElements(content)) {
      score *= 0.9;
      issues.push('low_engagement');
    }

    return { score, issues };
  }

  private async validateLanguageAccuracy(content: any): Promise<any> {
    // In a real implementation, this would use language processing tools
    // For now, we'll do basic validation
    
    let score = 1.0;
    const issues = [];

    // Check French text for obvious errors
    const frenchText = this.extractFrenchText(content);
    if (frenchText.length > 0) {
      const errors = this.detectBasicErrors(frenchText);
      if (errors.length > 0) {
        score *= Math.max(0.5, 1 - (errors.length * 0.1));
        issues.push('language_errors');
      }
    }

    return { score, issues };
  }

  // Helper methods
  private calculateLevelAppropriatenesScore(content: any, level: string): number {
    // Simplified level assessment based on vocabulary complexity
    const vocabulary = this.extractVocabulary(content);
    const avgComplexity = this.calculateAverageComplexity(vocabulary);
    const targetComplexity = this.getLevelComplexity(level);
    
    const difference = Math.abs(avgComplexity - targetComplexity);
    return Math.max(0, 1 - (difference * 0.2));
  }

  private isTooAdvanced(content: any, level: string): boolean {
    const complexity = this.calculateContentComplexity(content);
    const maxComplexity = this.getLevelComplexity(level) + 0.2;
    return complexity > maxComplexity;
  }

  private countExamples(content: any): number {
    let count = 0;
    if (content.examples) count += content.examples.length;
    if (content.vocabulary) {
      count += content.vocabulary.reduce((sum: number, item: any) => 
        sum + (item.examples?.length || 0), 0);
    }
    return count;
  }

  private getMinExamples(type: string): number {
    const minimums = {
      lesson: 3,
      vocabulary_drill: 5,
      grammar_exercise: 4,
      cultural_content: 2,
    };
    return minimums[type] || 3;
  }

  private hasCllearExplanations(content: any): boolean {
    if (content.explanation && content.explanation.length > 50) return true;
    if (content.sections?.some((s: any) => s.content?.length > 100)) return true;
    return false;
  }

  private hasEngagementElements(content: any): boolean {
    return !!(content.exercises || content.discussionQuestions || 
             content.interactiveElements || content.multimedia);
  }

  private extractFrenchText(content: any): string[] {
    const texts: string[] = [];
    
    if (content.vocabulary) {
      content.vocabulary.forEach((item: any) => {
        if (item.word) texts.push(item.word);
        if (item.examples) texts.push(...item.examples);
      });
    }
    
    if (content.examples) {
      texts.push(...content.examples);
    }

    return texts;
  }

  private detectBasicErrors(texts: string[]): string[] {
    const errors: string[] = [];
    
    texts.forEach(text => {
      // Very basic error detection - in production, use proper language tools
      if (text.includes('  ')) errors.push('double_spaces');
      if (!/^[A-ZÀÁÂÄÇÉÈÊËÏÎÔÙÛÜŸ]/.test(text)) errors.push('capitalization');
    });

    return errors;
  }

  private extractVocabulary(content: any): string[] {
    const vocab: string[] = [];
    
    if (content.vocabulary) {
      vocab.push(...content.vocabulary.map((item: any) => item.word || item));
    }
    
    return vocab;
  }

  private calculateAverageComplexity(vocabulary: string[]): number {
    if (vocabulary.length === 0) return 0.5;
    
    const complexities = vocabulary.map(word => this.getWordComplexity(word));
    return complexities.reduce((sum, complexity) => sum + complexity, 0) / complexities.length;
  }

  private getWordComplexity(word: string): number {
    // Simplified complexity calculation
    const length = word.length;
    if (length <= 4) return 0.2;
    if (length <= 6) return 0.4;
    if (length <= 8) return 0.6;
    if (length <= 10) return 0.8;
    return 1.0;
  }

  private getLevelComplexity(level: string): number {
    const complexities = {
      'A1': 0.2,
      'A2': 0.4,
      'B1': 0.6,
      'B2': 0.8,
      'C1': 0.9,
      'C2': 1.0,
    };
    return complexities[level] || 0.5;
  }

  private calculateContentComplexity(content: any): number {
    // Calculate overall content complexity
    const vocabComplexity = this.calculateAverageComplexity(this.extractVocabulary(content));
    const structureComplexity = this.calculateStructuralComplexity(content);
    
    return (vocabComplexity + structureComplexity) / 2;
  }

  private calculateStructuralComplexity(content: any): number {
    let complexity = 0.5; // Base complexity
    
    if (content.grammar) complexity += 0.2;
    if (content.culturalNotes) complexity += 0.1;
    if (content.exercises?.length > 5) complexity += 0.2;
    
    return Math.min(1.0, complexity);
  }
}
```

#### **3. Content Enhancer Service**
```typescript
// server/src/services/contentEnhancer.ts

import { LearningContext } from '../types/Content';

export class ContentEnhancer {
  async enhanceContent(content: any, context: LearningContext): Promise<any> {
    let enhanced = { ...content };

    // Add multimedia elements
    enhanced = await this.addMultimediaElements(enhanced, context);
    
    // Add pronunciation guides
    enhanced = await this.addPronunciationGuides(enhanced);
    
    // Add visual aids
    enhanced = await this.addVisualAids(enhanced, context);
    
    // Add interactive elements
    enhanced = await this.addInteractiveElements(enhanced, context);
    
    // Add cultural connections
    enhanced = await this.addCulturalConnections(enhanced);
    
    // Personalize for learning style
    enhanced = await this.personalizeForLearningStyle(enhanced, context);

    return enhanced;
  }

  private async addMultimediaElements(content: any, context: LearningContext): Promise<any> {
    if (content.vocabulary) {
      content.vocabulary = content.vocabulary.map((item: any) => ({
        ...item,
        audioUrl: this.generateAudioUrl(item.word),
        imageUrl: this.getRelevantImageUrl(item.word),
      }));
    }

    if (content.examples) {
      content.audioExamples = content.examples.map((example: string) => ({
        text: example,
        audioUrl: this.generateAudioUrl(example),
      }));
    }

    return content;
  }

  private async addPronunciationGuides(content: any): Promise<any> {
    if (content.vocabulary) {
      content.vocabulary = content.vocabulary.map((item: any) => ({
        ...item,
        ipa: this.generateIPA(item.word),
        syllables: this.breakIntoSyllables(item.word),
        stressPattern: this.getStressPattern(item.word),
      }));
    }

    return content;
  }

  private async addVisualAids(content: any, context: LearningContext): Promise<any> {
    if (context.learningStyle === 'visual' || context.learningStyle === 'mixed') {
      // Add diagrams for grammar concepts
      if (content.grammar) {
        content.visualGrammar = {
          diagram: this.generateGrammarDiagram(content.grammar),
          examples: this.createVisualExamples(content.grammar),
        };
      }

      // Add infographics for cultural content
      if (content.culturalNotes) {
        content.culturalInfographic = this.generateCulturalInfographic(content.culturalNotes);
      }
    }

    return content;
  }

  private async addInteractiveElements(content: any, context: LearningContext): Promise<any> {
    // Add drag-and-drop exercises
    if (content.exercises) {
      content.interactiveExercises = content.exercises.map((exercise: any) => ({
        ...exercise,
        interactive: this.createInteractiveVersion(exercise),
        gamified: this.addGamificationElements(exercise),
      }));
    }

    // Add conversation starters
    if (content.type === 'lesson') {
      content.conversationStarters = this.generateConversationStarters(content);
    }

    return content;
  }

  private async addCulturalConnections(content: any): Promise<any> {
    if (content.vocabulary) {
      content.vocabulary = content.vocabulary.map((item: any) => ({
        ...item,
        culturalContext: this.getCulturalContext(item.word),
        regionalVariations: this.getRegionalVariations(item.word),
      }));
    }

    return content;
  }

  private async personalizeForLearningStyle(content: any, context: LearningContext): Promise<any> {
    switch (context.learningStyle) {
      case 'visual':
        return this.enhanceForVisualLearners(content);
      case 'auditory':
        return this.enhanceForAuditoryLearners(content);
      case 'kinesthetic':
        return this.enhanceForKinestheticLearners(content);
      default:
        return content;
    }
  }

  // Helper methods for enhancement
  private generateAudioUrl(text: string): string {
    // In production, integrate with text-to-speech service
    return `/api/audio/tts?text=${encodeURIComponent(text)}&lang=fr`;
  }

  private getRelevantImageUrl(word: string): string {
    // In production, integrate with image API
    return `/api/images/vocabulary/${encodeURIComponent(word)}`;
  }

  private generateIPA(word: string): string {
    // Simplified IPA generation - in production, use proper phonetic library
    const ipaMap: Record<string, string> = {
      'bonjour': 'bon.ˈʒuʁ',
      'merci': 'mɛʁ.ˈsi',
      'au revoir': 'o ʁə.ˈvwaʁ',
    };
    return ipaMap[word.toLowerCase()] || word;
  }

  private breakIntoSyllables(word: string): string[] {
    // Simplified syllable breaking
    return word.match(/.{1,3}/g) || [word];
  }

  private getStressPattern(word: string): number[] {
    // Simplified stress pattern - in French, usually last syllable
    const syllables = this.breakIntoSyllables(word);
    return syllables.map((_, index) => index === syllables.length - 1 ? 1 : 0);
  }

  private generateGrammarDiagram(grammar: any): any {
    return {
      type: 'diagram',
      elements: [
        { type: 'rule', content: grammar.rule },
        { type: 'examples', content: grammar.examples },
      ],
    };
  }

  private createVisualExamples(grammar: any): any[] {
    return grammar.examples?.map((example: string) => ({
      text: example,
      highlighted: this.highlightGrammarElements(example, grammar.rule),
      visualization: 'color_coded',
    })) || [];
  }

  private generateCulturalInfographic(culturalNotes: any[]): any {
    return {
      type: 'infographic',
      sections: culturalNotes.map(note => ({
        title: note.title,
        visual: 'icon_representation',
        content: note.content,
      })),
    };
  }

  private createInteractiveVersion(exercise: any): any {
    return {
      type: 'drag_drop',
      instructions: exercise.instructions,
      items: exercise.items?.map((item: any) => ({
        ...item,
        draggable: true,
        targetZone: item.answer,
      })),
    };
  }

  private addGamificationElements(exercise: any): any {
    return {
      points: this.calculatePoints(exercise),
      badges: this.identifyEarnableBadges(exercise),
      hints: this.generateHints(exercise),
      progressBar: true,
    };
  }

  private generateConversationStarters(content: any): string[] {
    const vocabulary = content.vocabulary || [];
    return vocabulary.slice(0, 3).map((item: any) => 
      `How would you use "${item.word}" in a conversation about daily activities?`
    );
  }

  private getCulturalContext(word: string): any {
    // Simplified cultural context
    const contexts: Record<string, any> = {
      'baguette': {
        significance: 'Traditional French bread, central to French culture',
        usage: 'Bought fresh daily from boulangeries',
      },
      'café': {
        significance: 'Important social gathering place in France',
        usage: 'Used for socializing, not just quick coffee',
      },
    };
    return contexts[word.toLowerCase()] || null;
  }

  private getRegionalVariations(word: string): any[] {
    // Simplified regional variations
    return [
      { region: 'Quebec', variation: word, notes: 'Same usage' },
    ];
  }

  private enhanceForVisualLearners(content: any): any {
    return {
      ...content,
      visualEnhancements: {
        colorCoding: true,
        charts: true,
        images: true,
        mindMaps: true,
      },
    };
  }

  private enhanceForAuditoryLearners(content: any): any {
    return {
      ...content,
      auditoryEnhancements: {
        pronunciationFocus: true,
        listeningExercises: true,
        rhythmPatterns: true,
        verbalRepetition: true,
      },
    };
  }

  private enhanceForKinestheticLearners(content: any): any {
    return {
      ...content,
      kinestheticEnhancements: {
        handsonActivities: true,
        movementBasedLearning: true,
        physicalGestures: true,
        realWorldApplication: true,
      },
    };
  }

  // Additional helper methods
  private highlightGrammarElements(text: string, rule: string): any {
    // Highlight relevant grammar elements in the text
    return {
      text,
      highlights: [
        { start: 0, end: 5, type: 'subject' },
        { start: 6, end: 10, type: 'verb' },
      ],
    };
  }

  private calculatePoints(exercise: any): number {
    const basePoints = 10;
    const difficultyMultiplier = exercise.difficulty === 'hard' ? 2 : 1;
    return basePoints * difficultyMultiplier;
  }

  private identifyEarnableBadges(exercise: any): string[] {
    return ['Grammar Master', 'Vocabulary Builder', 'Perfect Practice'];
  }

  private generateHints(exercise: any): string[] {
    return [
      'Look at the word ending to determine gender',
      'Remember the verb conjugation patterns',
      'Consider the context of the sentence',
    ];
  }
}
```

## **Files to Create/Modify**

### **New Files**
```
server/src/services/
├── dynamicContentGenerator.ts  (Main content generation service)
├── contentValidator.ts         (Content quality validation)
├── contentEnhancer.ts         (Content enhancement and personalization)
└── contentTemplates.ts        (Content templates and structures)

server/src/types/
└── Content.ts                 (Content-specific types)

server/src/controllers/
└── contentController.ts       (Content API endpoints)

server/src/routes/
└── contentRoutes.ts          (Content routes)
```

### **Files to Modify**
```
server/src/services/promptTemplateEngine.ts (Add content generation prompts)
server/src/services/aiOrchestrator.ts       (Integrate content generation)
server/src/controllers/aiController.ts      (Add content methods)
server/src/routes/aiRoutes.ts              (Add content routes)
```

## **TypeScript Types**

### **Content Types**
```typescript
// server/src/types/Content.ts

export interface ContentRequest {
  userId: number;
  type: ContentType;
  level?: string;
  topics?: string[];
  duration?: number;
  focusAreas?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  includeExercises?: boolean;
  includeCulturalContext?: boolean;
  includeAudio?: boolean;
  includeExamples?: boolean;
  vocabulary?: string[];
  context?: string;
  grammarFocus?: string;
  difficulty?: string;
  exerciseCount?: number;
  culturalTopic?: string;
  adaptToWeaknesses?: boolean;
  reinforcePreviousLearning?: boolean;
  includeMoreExamples?: boolean;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  content: any;
  metadata: ContentMetadata;
  validation: ContentValidation;
  estimatedCompletionTime: number;
  learningObjectives: string[];
}

export interface ContentMetadata {
  userId: number;
  generatedAt: Date;
  level: string;
  topics: string[];
  aiGenerated: boolean;
  version: string;
  fallback?: boolean;
}

export interface ContentValidation {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions?: string[];
}

export interface ContentTemplate {
  structure: Record<string, string>;
  requirements: Record<string, any>;
  adaptations?: Record<string, string>;
}

export interface LearningContext {
  userId: number;
  currentLevel: string;
  learningStyle: string;
  weakAreas: string[];
  strengths: string[];
  interests: string[];
  recentTopics: string[];
  performanceHistory: any[];
}

export type ContentType = 
  | 'lesson'
  | 'vocabulary_drill'
  | 'grammar_exercise'
  | 'cultural_content'
  | 'personalized_exercise';
```

## **Testing Strategy**

### **Unit Tests**
```typescript
// server/src/tests/dynamicContentGenerator.test.ts

describe('DynamicContentGenerator', () => {
  let generator: DynamicContentGenerator;
  let mockOrchestrator: jest.Mocked<AIOrchestrator>;

  beforeEach(() => {
    mockOrchestrator = createMockOrchestrator();
    generator = new DynamicContentGenerator(mockOrchestrator);
  });

  describe('generateLesson', () => {
    it('should generate a complete lesson', async () => {
      mockOrchestrator.generateContent.mockResolvedValue({
        success: true,
        data: createMockLessonContent(),
      });

      const lesson = await generator.generateLesson(1, 'greetings', 'A1');
      
      expect(lesson.type).toBe('lesson');
      expect(lesson.content.title).toBeDefined();
      expect(lesson.content.sections).toHaveLength(4);
      expect(lesson.validation.isValid).toBe(true);
    });

    it('should include appropriate vocabulary for level', async () => {
      const lesson = await generator.generateLesson(1, 'family', 'A2');
      
      expect(lesson.content.vocabulary).toBeDefined();
      expect(lesson.content.vocabulary.length).toBeGreaterThan(3);
      expect(lesson.content.vocabulary.length).toBeLessThan(10);
    });
  });

  describe('generateVocabularyDrill', () => {
    it('should create vocabulary exercises', async () => {
      const vocabularySet = ['mère', 'père', 'fils', 'fille'];
      
      const drill = await generator.generateVocabularyDrill(
        1, 
        vocabularySet, 
        'family members'
      );
      
      expect(drill.type).toBe('vocabulary_drill');
      expect(drill.content.vocabulary).toBeDefined();
      expect(drill.content.vocabulary.length).toBe(vocabularySet.length);
    });

    it('should include pronunciation guides', async () => {
      const drill = await generator.generateVocabularyDrill(
        1, 
        ['bonjour'], 
        'greetings'
      );
      
      expect(drill.content.vocabulary[0].pronunciation).toBeDefined();
      expect(drill.content.vocabulary[0].ipa).toBeDefined();
    });
  });

  describe('content validation', () => {
    it('should validate content quality', async () => {
      const request = createContentRequest('lesson');
      
      const content = await generator.generateContent(request);
      
      expect(content.validation.isValid).toBe(true);
      expect(content.validation.score).toBeGreaterThan(0.7);
    });

    it('should regenerate if validation fails', async () => {
      // Mock validator to fail first attempt
      const mockValidator = jest.spyOn(generator['validator'], 'validateContent')
        .mockResolvedValueOnce({ isValid: false, score: 0.3, issues: ['too_difficult'] })
        .mockResolvedValueOnce({ isValid: true, score: 0.8, issues: [] });

      const request = createContentRequest('lesson');
      const content = await generator.generateContent(request);
      
      expect(mockValidator).toHaveBeenCalledTimes(2);
      expect(content.validation.isValid).toBe(true);
    });
  });

  describe('content enhancement', () => {
    it('should enhance content for visual learners', async () => {
      const context: LearningContext = {
        userId: 1,
        learningStyle: 'visual',
        // ... other properties
      };

      const content = await generator.generateLesson(1, 'colors', 'A1');
      
      expect(content.content.visualEnhancements