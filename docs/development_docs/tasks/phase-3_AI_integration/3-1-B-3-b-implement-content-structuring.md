# Task 3.1.B.3.b: Implement Content Structuring

## **Task Information**
- **Task ID**: 3.1.B.3.b
- **Parent Task**: 3.1.B.3 (Core Generation Logic)
- **Estimated Time**: 0.75 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.3.a (Raw Content Generation)
- **Status**: ⏳ Not Started

## **Objective**
Implement the `structureContent` method and content-type-specific structuring logic to transform raw AI output into strongly-typed content formats.

## **Success Criteria**
- [ ] `structureContent` method fully implemented
- [ ] Content structuring for all content types
- [ ] Type-safe content transformation
- [ ] Validation of structured content
- [ ] Helper methods for content processing

## **Implementation Details**

### **Files to Modify**
```
server/src/services/contentGeneration/DynamicContentGenerator.ts
content/fallback/ (new directory for fallback content)
```

### **1. Implement Main structureContent Method**

```typescript
// Add to DynamicContentGenerator class
private async structureContent(content: any, request: ContentRequest): Promise<StructuredContent> {
  try {
    switch (request.type) {
      case 'lesson':
        return this.structureLesson(content, request);
      case 'vocabulary_drill':
        return this.structureVocabulary(content, request);
      case 'grammar_exercise':
        return this.structureGrammar(content, request);
      case 'cultural_content':
        return this.structureCultural(content, request);
      case 'personalized_exercise':
        return this.structurePersonalized(content, request);
      case 'pronunciation_drill':
        return this.structurePronunciation(content, request);
      case 'conversation_practice':
        return this.structureConversation(content, request);
      default:
        throw new Error(`Unknown content type: ${request.type}`);
    }
  } catch (error) {
    console.error('Content structuring failed:', {
      type: request.type,
      userId: request.userId,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
```

### **2. Implement Content Type Structurers**

```typescript
private structureLesson(content: any, request: ContentRequest): any {
  return {
    type: 'lesson' as const,
    title: content.title || `French Lesson: ${request.topics?.[0] || 'Practice'}`,
    description: content.description || 'Interactive French language lesson',
    learningObjectives: content.objectives || content.learningObjectives || [
      'Learn new vocabulary',
      'Practice grammar concepts',
      'Improve comprehension',
    ],
    estimatedTime: content.estimatedTime || request.duration || 15,
    sections: this.createLessonSections(content),
    vocabulary: this.extractVocabulary(content),
    grammar: content.grammar || {},
    culturalNotes: content.culturalNotes || [],
    exercises: content.exercises || [],
  };
}

private structureVocabulary(content: any, request: ContentRequest): any {
  return {
    type: 'vocabulary_drill' as const,
    title: content.title || 'Vocabulary Practice',
    description: content.description || 'Practice and learn new French vocabulary',
    context: content.context || request.context || 'General vocabulary practice',
    vocabulary: content.vocabulary?.map((item: any) => ({
      word: item.word,
      definition: item.definition,
      pronunciation: item.pronunciation || this.generatePronunciation(item.word),
      ipa: item.ipa,
      examples: item.examples || [],
      difficulty: item.difficulty || 'medium',
      culturalContext: item.culturalContext,
    })) || [],
    exercises: content.exercises || this.generateVocabularyExercises(content.vocabulary),
    culturalContext: content.culturalContext,
  };
}

private structureGrammar(content: any, request: ContentRequest): any {
  return {
    type: 'grammar_exercise' as const,
    title: content.title || `Grammar: ${request.grammarFocus}`,
    grammarRule: content.rule || request.grammarFocus || '',
    explanation: content.explanation || '',
    examples: content.examples || [],
    exercises: content.exercises?.map((ex: any) => ({
      type: ex.type || 'fill_blank',
      instruction: ex.instruction || 'Complete the exercise',
      items: ex.items || [],
      feedback: ex.feedback || 'Good work!',
      difficulty: ex.difficulty || request.difficulty,
    })) || [],
    tips: content.tips || [],
    commonMistakes: content.commonMistakes || [],
  };
}

private structureCultural(content: any, request: ContentRequest): any {
  return {
    type: 'cultural_content' as const,
    title: content.title || `Cultural Insight: ${request.culturalTopic}`,
    topic: content.topic || request.culturalTopic || '',
    description: content.description || '',
    keyPoints: content.keyPoints || [],
    vocabulary: this.extractVocabulary(content),
    discussionQuestions: content.discussionQuestions || [],
    multimedia: content.multimedia || [],
    connections: content.connections || [],
  };
}

private structurePersonalized(content: any, request: ContentRequest): any {
  return {
    type: 'personalized_exercise' as const,
    title: content.title || 'Personalized Practice',
    description: content.description || 'Exercises tailored to your learning needs',
    focusAreas: request.focusAreas || [],
    exercises: content.exercises || [],
    adaptiveElements: content.adaptiveElements || [],
    difficulty: request.difficulty || 'medium',
    estimatedTime: content.estimatedTime || request.duration || 15,
  };
}

private structurePronunciation(content: any, request: ContentRequest): any {
  return {
    type: 'pronunciation_drill' as const,
    title: content.title || 'Pronunciation Practice',
    description: content.description || 'Practice French pronunciation',
    words: content.words?.map((word: any) => ({
      text: word.text,
      ipa: word.ipa,
      audioUrl: word.audioUrl,
      difficulty: word.difficulty || 'medium',
    })) || [],
    exercises: content.exercises || [],
    tips: content.tips || [],
  };
}

private structureConversation(content: any, request: ContentRequest): any {
  return {
    type: 'conversation_practice' as const,
    title: content.title || 'Conversation Practice',
    description: content.description || 'Practice French conversation',
    scenario: content.scenario || 'General conversation',
    dialogue: content.dialogue || [],
    vocabulary: this.extractVocabulary(content),
    phrases: content.phrases || [],
    culturalNotes: content.culturalNotes || [],
  };
}
```

### **3. Implement Helper Methods**

```typescript
private createLessonSections(content: any): any[] {
  const sections = [];
  
  if (content.introduction) {
    sections.push({
      type: 'introduction',
      title: 'Introduction',
      content: content.introduction,
      duration: 2,
    });
  }

  if (content.presentation) {
    sections.push({
      type: 'presentation',
      title: 'New Content',
      content: content.presentation,
      vocabulary: content.vocabulary || [],
      grammar: content.grammar,
      duration: Math.ceil((content.estimatedTime || 15) * 0.4),
    });
  }

  if (content.practice || content.exercises) {
    sections.push({
      type: 'practice',
      title: 'Practice',
      content: content.practice || 'Practice what you\'ve learned',
      exercises: content.exercises || [],
      duration: Math.ceil((content.estimatedTime || 15) * 0.4),
    });
  }

  if (content.summary || content.wrapUp) {
    sections.push({
      type: 'wrap_up',
      title: 'Summary',
      content: content.summary || content.wrapUp,
      duration: 2,
    });
  }

  // Ensure at least one section exists
  if (sections.length === 0) {
    sections.push({
      type: 'practice',
      title: 'Practice',
      content: 'Practice French language skills',
      duration: 10,
    });
  }

  return sections;
}

private extractVocabulary(content: any): any[] {
  if (content.vocabulary && Array.isArray(content.vocabulary)) {
    return content.vocabulary;
  }
  
  // Extract vocabulary from content text if not explicitly provided
  // This is a simplified extraction - could be enhanced with NLP
  if (content.content && typeof content.content === 'string') {
    // Basic vocabulary extraction logic could go here
    return [];
  }
  
  return [];
}

private generateVocabularyExercises(vocabulary: any[]): any[] {
  if (!vocabulary || vocabulary.length === 0) return [];

  const exercises = [];

  // Add matching exercise
  if (vocabulary.length >= 3) {
    exercises.push({
      type: 'matching',
      instruction: 'Match the French words with their English definitions',
      items: vocabulary.slice(0, Math.min(6, vocabulary.length)).map(item => ({
        french: item.word,
        english: item.definition,
      })),
      feedback: 'Excellent vocabulary practice!',
    });
  }

  // Add fill-in-the-blank exercise
  if (vocabulary.length >= 2) {
    exercises.push({
      type: 'fill_blank',
      instruction: 'Fill in the blanks with the correct French words',
      items: vocabulary.slice(0, Math.min(4, vocabulary.length)).map(item => ({
        sentence: `The French word for "${item.definition}" is ______.`,
        answer: item.word,
      })),
      feedback: 'Great job with vocabulary usage!',
    });
  }

  return exercises;
}

private generatePronunciation(word: string): string {
  // Basic pronunciation generation
  // TODO: Reference Future Implementation #35 - External Content Configuration System
  const pronunciationMap: Record<string, string> = {
    'bonjour': 'bon-ZHOOR',
    'merci': 'mer-SEE',
    'au revoir': 'oh ruh-VWAHR',
    'comment': 'koh-MAHN',
    'ça va': 'sah VAH',
    'oui': 'WEE',
    'non': 'NOHN',
    'excusez-moi': 'eks-koo-zay MWAH',
    'pardon': 'par-DOHN',
    's\'il vous plaît': 'see voo PLAY',
  };
  
  return pronunciationMap[word.toLowerCase()] || word;
}
```

### **4. Create Fallback Content Structure**

```
content/fallback/
├── lesson-basic.json
├── vocabulary-basic.json
├── grammar-basic.json
└── cultural-basic.json
```

## **Dependencies**
- Task 3.1.B.3.a (Raw Content Generation) for content input
- Content types from `../../types/Content`
- Fallback content templates

## **Review Points**
1. **Type Safety**: Verify all structured content matches TypeScript interfaces
2. **Content Quality**: Validate that structured content provides educational value
3. **Error Handling**: Check graceful handling of malformed AI responses
4. **Extensibility**: Ensure easy addition of new content types

## **Possible Issues & Solutions**
1. **Issue**: AI content might be missing required fields
   - **Solution**: Provide sensible defaults and fallback values
2. **Issue**: Content structuring might be too rigid
   - **Solution**: Make structuring more flexible and configurable
3. **Issue**: Pronunciation generation is basic
   - **Solution**: Integrate with external pronunciation API in future

## **Testing Strategy**
- Unit tests for each structuring method with various input formats
- Validation of output structure against TypeScript interfaces
- Edge case testing with malformed or incomplete AI responses
- Content quality validation

## **Next Steps**
After completion, proceed to Task 3.1.B.3.c (Implement User Context Service)
