# Task 3.1.B.4: Implement Validator & Enhancer Services

## **Task Information**
- **Task ID**: 3.1.B.4
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 1.5 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.3 (Implement Core Generation Logic)
- **Status**: ⏳ Not Started

## **Objective**
Implement the Strategy Pattern-based content validation and enhancement services. This includes creating specialized validators and enhancers for each content type, along with factory classes to manage them efficiently.

## **Success Criteria**
- [ ] Strategy Pattern implemented for validators and enhancers
- [ ] Content-specific validation logic for each content type
- [ ] Enhancement services with multimedia and personalization features
- [ ] Factory classes for managing validator and enhancer instances
- [ ] Template management system implemented
- [ ] Comprehensive validation rules established
- [ ] Performance optimizations in place

## **Implementation Details**

### **1. Content Validation Services (Strategy Pattern)**

Implement specialized validators for each content type using the Strategy Pattern.

```typescript
// server/src/services/contentGeneration/validation/LessonValidator.ts

import { IContentValidator } from '../interfaces';
import { ContentValidation, ContentRequest } from '../../../types/Content';

export class LessonValidator implements IContentValidator {
  async validate(content: any, request: ContentRequest): Promise<ContentValidation> {
    const validation: ContentValidation = {
      isValid: true,
      score: 1.0,
      issues: [],
      suggestions: [],
      confidence: 1.0,
    };

    // Structure validation
    const structureIssues = this.validateStructure(content);
    validation.issues.push(...structureIssues);

    // Educational quality validation
    const qualityIssues = this.validateEducationalQuality(content, request);
    validation.issues.push(...qualityIssues);

    // Language level appropriateness
    const levelIssues = this.validateLevelAppropriateness(content, request.level);
    validation.issues.push(...levelIssues);

    // Calculate final score and validity
    validation.score = this.calculateScore(validation.issues);
    validation.isValid = validation.score >= 0.7 && validation.issues.length === 0;
    validation.confidence = this.calculateConfidence(content, validation.issues);

    // Generate suggestions for improvement
    validation.suggestions = this.generateSuggestions(validation.issues);

    return validation;
  }

  private validateStructure(content: any): string[] {
    const issues: string[] = [];

    if (!content.title || content.title.length < 5) {
      issues.push('missing_or_short_title');
    }

    if (!content.description) {
      issues.push('missing_description');
    }

    if (!content.sections || content.sections.length < 2) {
      issues.push('insufficient_sections');
    }

    if (!content.learningObjectives || content.learningObjectives.length === 0) {
      issues.push('missing_learning_objectives');
    }

    if (!content.vocabulary || content.vocabulary.length < 3) {
      issues.push('insufficient_vocabulary');
    }

    return issues;
  }

  private validateEducationalQuality(content: any, request: ContentRequest): string[] {
    const issues: string[] = [];

    // Check for sufficient examples
    const exampleCount = this.countExamples(content);
    if (exampleCount < 3) {
      issues.push('insufficient_examples');
    }

    // Check for clear progression
    if (!this.hasLogicalProgression(content)) {
      issues.push('poor_progression');
    }

    // Check for engagement elements
    if (!this.hasEngagementElements(content)) {
      issues.push('low_engagement');
    }

    // Check duration appropriateness
    if (content.estimatedTime && request.duration) {
      const timeDiff = Math.abs(content.estimatedTime - request.duration);
      if (timeDiff > request.duration * 0.3) {
        issues.push('inappropriate_duration');
      }
    }

    return issues;
  }

  private validateLevelAppropriateness(content: any, level?: string): string[] {
    const issues: string[] = [];

    if (!level) return issues;

    const complexityScore = this.calculateContentComplexity(content);
    const targetComplexity = this.getLevelComplexity(level);

    if (complexityScore > targetComplexity + 0.3) {
      issues.push('too_difficult');
    } else if (complexityScore < targetComplexity - 0.3) {
      issues.push('too_simple');
    }

    return issues;
  }

  private countExamples(content: any): number {
    let count = 0;
    
    if (content.vocabulary) {
      count += content.vocabulary.reduce((sum: number, item: any) => 
        sum + (item.examples?.length || 0), 0);
    }

    if (content.sections) {
      count += content.sections.reduce((sum: number, section: any) => 
        sum + (section.examples?.length || 0), 0);
    }

    return count;
  }

  private hasLogicalProgression(content: any): boolean {
    if (!content.sections || content.sections.length < 2) return false;

    // Check if sections follow a logical order (intro -> content -> practice -> summary)
    const sectionTypes = content.sections.map((s: any) => s.type);
    const expectedOrder = ['introduction', 'presentation', 'practice', 'wrap_up'];
    
    let lastIndex = -1;
    for (const type of sectionTypes) {
      const currentIndex = expectedOrder.indexOf(type);
      if (currentIndex !== -1 && currentIndex < lastIndex) {
        return false;
      }
      if (currentIndex !== -1) {
        lastIndex = currentIndex;
      }
    }

    return true;
  }

  private hasEngagementElements(content: any): boolean {
    return !!(
      content.exercises ||
      content.culturalNotes ||
      content.interactiveElements ||
      (content.sections && content.sections.some((s: any) => s.exercises))
    );
  }

  private calculateContentComplexity(content: any): number {
    let complexity = 0.5; // Base complexity

    // Vocabulary complexity
    if (content.vocabulary) {
      const avgWordLength = content.vocabulary.reduce((sum: number, item: any) => 
        sum + (item.word?.length || 0), 0) / content.vocabulary.length;
      complexity += Math.min(0.3, avgWordLength / 20);
    }

    // Grammar complexity
    if (content.grammar) {
      complexity += 0.2;
    }

    // Cultural content adds complexity
    if (content.culturalNotes && content.culturalNotes.length > 0) {
      complexity += 0.1;
    }

    return Math.min(1.0, complexity);
  }

  private getLevelComplexity(level: string): number {
    const complexities: Record<string, number> = {
      'A1': 0.2,
      'A2': 0.4,
      'B1': 0.6,
      'B2': 0.8,
      'C1': 0.9,
      'C2': 1.0,
    };
    return complexities[level] || 0.5;
  }

  private calculateScore(issues: string[]): number {
    if (issues.length === 0) return 1.0;

    const severity: Record<string, number> = {
      'missing_title': 0.3,
      'missing_description': 0.2,
      'insufficient_sections': 0.4,
      'missing_learning_objectives': 0.3,
      'insufficient_vocabulary': 0.2,
      'insufficient_examples': 0.2,
      'poor_progression': 0.3,
      'low_engagement': 0.2,
      'too_difficult': 0.4,
      'too_simple': 0.3,
      'inappropriate_duration': 0.1,
    };

    const totalSeverity = issues.reduce((sum, issue) => sum + (severity[issue] || 0.1), 0);
    return Math.max(0, 1 - totalSeverity);
  }

  private calculateConfidence(content: any, issues: string[]): number {
    let confidence = 1.0;

    // Lower confidence for missing critical fields
    if (!content.title) confidence -= 0.2;
    if (!content.sections) confidence -= 0.3;
    if (!content.vocabulary) confidence -= 0.2;

    // Lower confidence for many issues
    confidence -= issues.length * 0.1;

    return Math.max(0.1, confidence);
  }

  private generateSuggestions(issues: string[]): string[] {
    const suggestions: string[] = [];

    if (issues.includes('missing_title')) {
      suggestions.push('Add a clear, descriptive title for the lesson');
    }
    if (issues.includes('insufficient_examples')) {
      suggestions.push('Include more practical examples for each concept');
    }
    if (issues.includes('poor_progression')) {
      suggestions.push('Reorganize sections in logical order: intro → content → practice → summary');
    }
    if (issues.includes('too_difficult')) {
      suggestions.push('Simplify vocabulary and grammar concepts for the target level');
    }
    if (issues.includes('low_engagement')) {
      suggestions.push('Add interactive exercises or cultural elements');
    }

    return suggestions;
  }
}
```

```typescript
// server/src/services/contentGeneration/validation/VocabularyDrillValidator.ts

import { IContentValidator } from '../interfaces';
import { ContentValidation, ContentRequest } from '../../../types/Content';

export class VocabularyDrillValidator implements IContentValidator {
  async validate(content: any, request: ContentRequest): Promise<ContentValidation> {
    const validation: ContentValidation = {
      isValid: true,
      score: 1.0,
      issues: [],
      suggestions: [],
      confidence: 1.0,
    };

    // Vocabulary-specific validation
    const vocabIssues = this.validateVocabulary(content, request);
    validation.issues.push(...vocabIssues);

    // Exercise validation
    const exerciseIssues = this.validateExercises(content);
    validation.issues.push(...exerciseIssues);

    // Context validation
    const contextIssues = this.validateContext(content, request);
    validation.issues.push(...contextIssues);

    validation.score = this.calculateScore(validation.issues);
    validation.isValid = validation.score >= 0.7;
    validation.confidence = this.calculateConfidence(content);
    validation.suggestions = this.generateSuggestions(validation.issues);

    return validation;
  }

  private validateVocabulary(content: any, request: ContentRequest): string[] {
    const issues: string[] = [];

    if (!content.vocabulary || content.vocabulary.length === 0) {
      issues.push('missing_vocabulary');
      return issues;
    }

    // Check vocabulary quantity
    if (content.vocabulary.length < 4) {
      issues.push('insufficient_vocabulary');
    } else if (content.vocabulary.length > 15) {
      issues.push('excessive_vocabulary');
    }

    // Check vocabulary quality
    let invalidItems = 0;
    content.vocabulary.forEach((item: any) => {
      if (!item.word || !item.definition) {
        invalidItems++;
      }
      if (!item.examples || item.examples.length === 0) {
        invalidItems++;
      }
    });

    if (invalidItems > content.vocabulary.length * 0.3) {
      issues.push('poor_vocabulary_quality');
    }

    return issues;
  }

  private validateExercises(content: any): string[] {
    const issues: string[] = [];

    if (!content.exercises || content.exercises.length === 0) {
      issues.push('missing_exercises');
      return issues;
    }

    // Check exercise variety
    const exerciseTypes = new Set(content.exercises.map((ex: any) => ex.type));
    if (exerciseTypes.size < 2) {
      issues.push('insufficient_exercise_variety');
    }

    // Check exercise quality
    const invalidExercises = content.exercises.filter((ex: any) => 
      !ex.instruction || !ex.items || ex.items.length === 0
    ).length;

    if (invalidExercises > 0) {
      issues.push('invalid_exercises');
    }

    return issues;
  }

  private validateContext(content: any, request: ContentRequest): string[] {
    const issues: string[] = [];

    if (!content.context && !request.context) {
      issues.push('missing_context');
    }

    if (content.context && content.context.length < 10) {
      issues.push('insufficient_context');
    }

    return issues;
  }

  private calculateScore(issues: string[]): number {
    const severity: Record<string, number> = {
      'missing_vocabulary': 0.8,
      'insufficient_vocabulary': 0.3,
      'excessive_vocabulary': 0.2,
      'poor_vocabulary_quality': 0.4,
      'missing_exercises': 0.6,
      'insufficient_exercise_variety': 0.2,
      'invalid_exercises': 0.4,
      'missing_context': 0.3,
      'insufficient_context': 0.1,
    };

    const totalSeverity = issues.reduce((sum, issue) => sum + (severity[issue] || 0.1), 0);
    return Math.max(0, 1 - totalSeverity);
  }

  private calculateConfidence(content: any): number {
    let confidence = 1.0;

    if (!content.vocabulary) confidence -= 0.5;
    if (!content.exercises) confidence -= 0.3;
    if (!content.context) confidence -= 0.2;

    return Math.max(0.1, confidence);
  }

  private generateSuggestions(issues: string[]): string[] {
    const suggestions: string[] = [];

    if (issues.includes('missing_vocabulary')) {
      suggestions.push('Add vocabulary items with words, definitions, and examples');
    }
    if (issues.includes('insufficient_exercise_variety')) {
      suggestions.push('Include different exercise types: matching, fill-in-the-blank, multiple choice');
    }
    if (issues.includes('missing_context')) {
      suggestions.push('Provide context for when and how to use this vocabulary');
    }

    return suggestions;
  }
}
```

### **2. Content Enhancement Services (Strategy Pattern)**

```typescript
// server/src/services/contentGeneration/enhancement/LessonEnhancer.ts

import { IContentEnhancer } from '../interfaces';
import { LearningContext } from '../../../types/Content';

export class LessonEnhancer implements IContentEnhancer {
  async enhance(content: any, context: LearningContext): Promise<any> {
    let enhanced = { ...content };

    // Add personalization based on learning style
    enhanced = await this.personalizeForLearningStyle(enhanced, context);
    
    // Add multimedia elements
    enhanced = await this.addMultimediaElements(enhanced);
    
    // Add cultural connections
    enhanced = await this.addCulturalConnections(enhanced);
    
    // Add pronunciation guides
    enhanced = await this.addPronunciationGuides(enhanced);
    
    // Add adaptive elements based on user progress
    enhanced = await this.addAdaptiveElements(enhanced, context);

    return enhanced;
  }

  private async personalizeForLearningStyle(content: any, context: LearningContext): Promise<any> {
    const enhanced = { ...content };

    switch (context.learningStyle) {
      case 'visual':
        enhanced.visualEnhancements = {
          colorCoding: true,
          diagrams: this.generateDiagrams(content),
          infographics: this.generateInfographics(content),
          mindMaps: this.generateMindMaps(content),
        };
        break;

      case 'auditory':
        enhanced.auditoryEnhancements = {
          pronunciationFocus: true,
          rhythmPatterns: this.generateRhythmPatterns(content),
          listeningExercises: this.generateListeningExercises(content),
          verbalRepetition: true,
        };
        break;

      case 'kinesthetic':
        enhanced.kinestheticEnhancements = {
          handsonActivities: this.generateHandsOnActivities(content),
          movementBasedLearning: true,
          physicalGestures: this.generateGestures(content),
          realWorldApplication: this.generateRealWorldScenarios(content),
        };
        break;

      default: // mixed
        enhanced.mixedEnhancements = {
          multiModalElements: true,
          variedActivityTypes: this.generateVariedActivities(content),
          adaptivePresentation: true,
        };
    }

    return enhanced;
  }

  private async addMultimediaElements(content: any): Promise<any> {
    const enhanced = { ...content };

    // Add audio for vocabulary
    if (enhanced.vocabulary) {
      enhanced.vocabulary = enhanced.vocabulary.map((item: any) => ({
        ...item,
        audioUrl: this.generateAudioUrl(item.word),
        slowAudioUrl: this.generateAudioUrl(item.word, 'slow'),
      }));
    }

    // Add images for concepts
    enhanced.images = this.generateRelevantImages(content);

    // Add video suggestions
    enhanced.videoSuggestions = this.generateVideoSuggestions(content);

    return enhanced;
  }

  private async addCulturalConnections(content: any): Promise<any> {
    const enhanced = { ...content };

    // Add cultural notes if not present
    if (!enhanced.culturalNotes) {
      enhanced.culturalNotes = [];
    }

    // Generate cultural connections based on vocabulary
    if (enhanced.vocabulary) {
      const culturalVocab = enhanced.vocabulary.filter((item: any) => 
        this.hasCulturalSignificance(item.word)
      );

      culturalVocab.forEach((item: any) => {
        enhanced.culturalNotes.push({
          title: `Cultural Context: ${item.word}`,
          content: this.getCulturalContext(item.word),
          relevance: 'high',
        });
      });
    }

    return enhanced;
  }

  private async addPronunciationGuides(content: any): Promise<any> {
    const enhanced = { ...content };

    if (enhanced.vocabulary) {
      enhanced.vocabulary = enhanced.vocabulary.map((item: any) => ({
        ...item,
        ipa: this.generateIPA(item.word),
        syllables: this.breakIntoSyllables(item.word),
        stressPattern: this.getStressPattern(item.word),
        pronunciationTips: this.generatePronunciationTips(item.word),
      }));
    }

    return enhanced;
  }

  private async addAdaptiveElements(content: any, context: LearningContext): Promise<any> {
    const enhanced = { ...content };

    // Add difficulty adjustments based on user progress
    enhanced.adaptiveElements = {
      difficultyAdjustments: this.generateDifficultyAdjustments(context),
      personalizedExercises: this.generatePersonalizedExercises(content, context),
      weaknessTargeting: this.generateWeaknessTargeting(content, context),
    };

    return enhanced;
  }

  // Helper methods for multimedia generation
  private generateAudioUrl(text: string, speed: string = 'normal'): string {
    const baseUrl = '/api/audio/tts';
    const params = new URLSearchParams({
      text,
      lang: 'fr',
      speed,
    });
    return `${baseUrl}?${params}`;
  }

  private generateRelevantImages(content: any): any[] {
    // Generate image suggestions based on content topics
    const images = [];
    
    if (content.vocabulary) {
      content.vocabulary.forEach((item: any) => {
        if (this.isVisualConcept(item.word)) {
          images.push({
            concept: item.word,
            url: `/api/images/concept/${encodeURIComponent(item.word)}`,
            alt: `Visual representation of ${item.word}`,
            type: 'concept_illustration',
          });
        }
      });
    }

    return images;
  }

  private generateDiagrams(content: any): any[] {
    if (!content.grammar) return [];

    return [{
      type: 'grammar_diagram',
      title: `Grammar Structure: ${content.grammar.rule}`,
      elements: this.createGrammarDiagramElements(content.grammar),
    }];
  }

  private generateInfographics(content: any): any[] {
    return [{
      type: 'lesson_overview',
      title: 'Lesson Overview',
      sections: content.sections?.map((section: any) => ({
        title: section.title,
        duration: section.duration,
        keyPoints: this.extractKeyPoints(section),
      })) || [],
    }];
  }

  private generateMindMaps(content: any): any {
    return {
      type: 'mind_map',
      central_topic: content.title,
      branches: content.vocabulary?.slice(0, 6).map((item: any) => ({
        concept: item.word,
        definition: item.definition,
        examples: item.examples?.slice(0, 2) || [],
      })) || [],
    };
  }

  // Additional helper methods
  private hasCulturalSignificance(word: string): boolean {
    const culturalWords = ['baguette', 'café', 'bistro', 'château', 'fromage', 'vin'];
    return culturalWords.includes(word.toLowerCase());
  }

  private getCulturalContext(word: string): string {
    const contexts: Record<string, string> = {
      'baguette': 'Traditional French bread, central to French daily life and culture',
      'café': 'Important social gathering place in France, not just for quick coffee',
      'fromage': 'France produces over 400 types of cheese, deeply embedded in French culture',
    };
    return contexts[word.toLowerCase()] || 'This word has cultural significance in French society';
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
    // Simplified syllable breaking for French
    return word.match(/.{1,3}/g) || [word];
  }

  private getStressPattern(word: string): number[] {
    // In French, stress is typically on the last syllable
    const syllables = this.breakIntoSyllables(word);
    return syllables.map((_, index) => index === syllables.length - 1 ? 1 : 0);
  }

  private generatePronunciationTips(word: string): string[] {
    const tips: string[] = [];
    
    if (word.includes('r')) {
      tips.push('Roll the "r" sound gently at the back of your throat');
    }
    if (word.includes('eu')) {
      tips.push('The "eu" sound is similar to "uh" but with rounded lips');
    }
    if (word.endsWith('e')) {
      tips.push('Silent "e" at the end - don\'t pronounce it');
    }

    return tips;
  }

  private isVisualConcept(word: string): boolean {
    const visualConcepts = ['maison', 'chat', 'voiture', 'arbre', 'fleur', 'couleur'];
    return visualConcepts.includes(word.toLowerCase());
  }

  private createGrammarDiagramElements(grammar: any): any[] {
    return [
      { type: 'rule', content: grammar.rule },
      { type: 'examples', content: grammar.examples },
    ];
  }

  private extractKeyPoints(section: any): string[] {
    // Extract key points from section content
    if (section.vocabulary) {
      return section.vocabulary.slice(0, 3).map((item: any) => item.word);
    }
    return [];
  }

  private generateDifficultyAdjustments(context: LearningContext): any {
    return {
      basedOnWeakAreas: context.weakAreas,
      adjustmentLevel: this.calculateAdjustmentLevel(context),
      focusAreas: context.weakAreas.slice(0, 2),
    };
  }

  private generatePersonalizedExercises(content: any, context: LearningContext): any[] {
    const exercises = [];

    // Create exercises targeting weak areas
    context.weakAreas.forEach(weakArea => {
      if (weakArea === 'pronunciation' && content.vocabulary) {
        exercises.push({
          type: 'pronunciation_drill',
          focus: weakArea,
          items: content.vocabulary.slice(0, 3),
        });
      }
    });

    return exercises;
  }

  private generateWeaknessTargeting(content: any, context: LearningContext): any {
    return {
      targetedAreas: context.weakAreas,
      reinforcementStrategies: this.generateReinforcementStrategies(context.weakAreas),
      adaptiveContent: this.generateAdaptiveContent(content, context.weakAreas),
    };
  }

  private calculateAdjustmentLevel(context: LearningContext): string {
    const weaknessRatio = context.weakAreas.length / (context.weakAreas.length + context.strengths.length);
    if (weaknessRatio > 0.6) return 'high';
    if (weaknessRatio > 0.3) return 'medium';
    return 'low';
  }

  private generateReinforcementStrategies(weakAreas: string[]): string[] {
    const strategies: Record<string, string> = {
      'pronunciation': 'Increased audio practice and phonetic guidance',
      'verb_conjugation': 'Pattern recognition exercises and conjugation drills',
      'vocabulary': 'Spaced repetition and contextual usage practice',
    };

    return weakAreas.map(area => strategies[area] || 'Additional practice exercises');
  }

  private generateAdaptiveContent(content: any, weakAreas: string[]): any {
    return {
      additionalExercises: this.createTargetedExercises(weakAreas),
      reinforcementMaterial: this.createReinforcementMaterial(weakAreas),
      progressionPath: this.createProgressionPath(weakAreas),
    };
  }

  private createTargetedExercises(weakAreas: string[]): any[] {
    return weakAreas.map(area => ({
      type: `${area}_drill`,
      difficulty: 'adaptive',
      focus: area,
    }));
  }

  private createReinforcementMaterial(weakAreas: string[]): any[] {
    return weakAreas.map(area => ({
      type: 'reinforcement',
      area,
      materials: [`${area}_guide`, `${area}_examples`],
    }));
  }

  private createProgressionPath(weakAreas: string[]): any {
    return {
      currentFocus: weakAreas[0],
      nextSteps: weakAreas.slice(1),
      milestones: weakAreas.map(area => `Master ${area}`),
    };
  }

  // Placeholder methods for different learning styles
  private generateRhythmPatterns(content: any): any[] {
    return [{ pattern: 'French syllable rhythm', examples: [] }];
  }

  private generateListeningExercises(content: any): any[] {
    return [{ type: 'listen_and_repeat', items: [] }];
  }

  private generateHandsOnActivities(content: any): any[] {
    return [{ type: 'role_play', scenario: 'ordering at a café' }];
  }

  private generateGestures(content: any): any[] {
    return [{ gesture: 'hand_wave', for: 'bonjour' }];
  }

  private generateRealWorldScenarios(content: any): any[] {
    return [{ scenario: 'shopping', vocabulary: [] }];
  }

  private generateVariedActivities(content: any): any[] {
    return [
      { type: 'visual', activity: 'image_matching' },
      { type: 'auditory', activity: 'listen_and_repeat' },
      { type: 'kinesthetic', activity: 'gesture_practice' },
    ];
  }

  private generateVideoSuggestions(content: any): any[] {
    return [{
      title: 'French pronunciation guide',
      url: '/videos/pronunciation',
      duration: 300,
    }];
  }
}
```

### **3. Factory Classes**

```typescript
// server/src/services/contentGeneration/factories/ContentValidatorFactory.ts

import { ContentType } from '../../../types/Content';
import { 
  IContentValidator,
  IContentValidatorFactory 
} from '../interfaces';
import { LessonValidator } from '../validation/LessonValidator';
import { VocabularyDrillValidator } from '../validation/VocabularyDrillValidator';
import { GrammarExerciseValidator } from '../validation/GrammarExerciseValidator';
import { CulturalContentValidator } from '../validation/CulturalContentValidator';
import { PersonalizedExerciseValidator } from '../validation/PersonalizedExerciseValidator';

export class ContentValidatorFactory implements IContentValidatorFactory {
  private validators: Map<ContentType, IContentValidator>;

  constructor() {
    this.validators = new Map();
    this.initializeValidators();
  }

  getValidator(type: ContentType): IContentValidator {
    const validator = this.validators.get(type);
    if (!validator) {
      throw new Error(`Validator for content type "${type}" not found`);
    }
    return validator;
  }

  private initializeValidators(): void {
    this.validators.set('lesson', new LessonValidator());
    this.validators.set('vocabulary_drill', new VocabularyDrillValidator());
    this.validators.set('grammar_exercise', new GrammarExerciseValidator());
    this.validators.set('cultural_content', new CulturalContentValidator());
    this.validators.set('personalized_exercise', new PersonalizedExerciseValidator());
    // TODO: Add pronunciation_drill and conversation_practice validators
  }

  // Method to register new validators dynamically
  registerValidator(type: Content
