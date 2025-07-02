import { IContentStructurer, StructuredContent } from './IContentStructurer';
import { VocabularyStructurer } from './VocabularyStructurer';
import { ContentType } from '../../types/Content';
// Import other structurers like LessonStructurer here as they are created

export class ContentStructurerFactory {
  private structurers: Map<ContentType, IContentStructurer<StructuredContent>>;

  constructor() {
    this.structurers = new Map();
    // The system is now pluggable. Add new types by registering them here.
    this.structurers.set('vocabulary_drill', new VocabularyStructurer());
    // this.structurers.set('lesson', new LessonStructurer());
  }

  public getStructurer(contentType: ContentType): IContentStructurer<StructuredContent> {
    const structurer = this.structurers.get(contentType);
    if (!structurer) {
      throw new Error(`No structurer registered for content type: ${contentType}`);
    }
    return structurer;
  }
}
