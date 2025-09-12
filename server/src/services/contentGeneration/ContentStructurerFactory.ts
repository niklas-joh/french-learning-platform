import { IContentStructurer, StructuredContent } from './IContentStructurer.js';
import { VocabularyStructurer } from './VocabularyStructurer.js';
import { LessonStructurer } from './LessonStructurer.js';
import { GrammarExerciseStructurer } from './GrammarExerciseStructurer.js';
import { ContentType } from '../../types/Content.js';

export class ContentStructurerFactory {
  private structurers: Map<ContentType, IContentStructurer<StructuredContent>>;

  constructor() {
    this.structurers = new Map();
    // The system is now pluggable. Add new types by registering them here.
    this.structurers.set('vocabulary_drill', new VocabularyStructurer());
    this.structurers.set('lesson', new LessonStructurer());
    this.structurers.set('grammar_exercise', new GrammarExerciseStructurer());
  }

  public getStructurer(contentType: ContentType): IContentStructurer<StructuredContent> {
    const structurer = this.structurers.get(contentType);
    if (!structurer) {
      throw new Error(`No structurer registered for content type: ${contentType}`);
    }
    return structurer;
  }
}
