import { BaseEnhancer } from './BaseEnhancer';
import { IStructuredLesson, ContentType, LearningContext } from '../../../types/Content';
import { ILogger } from '../../../types/ILogger';

/**
 * Concrete enhancer for Lesson content.
 */
export class LessonEnhancer extends BaseEnhancer {
  protected readonly contentType: ContentType = 'lesson';

  constructor(logger: ILogger) {
    super(logger);
  }

  /**
   * Enhances the lesson content. For now, this is a simple rule-based enhancement.
   * Future versions could use AI for more sophisticated enhancements.
   * @param content - The lesson content to enhance.
   * @param context - The user's learning context.
   * @returns A promise that resolves to the enhanced lesson content.
   */
  async enhance(content: IStructuredLesson, context: LearningContext): Promise<IStructuredLesson> {
    this.logger.info(`[Enhancer] Running LessonEnhancer for user ${context.userId} on lesson: ${content.title}`);

    // Example enhancement: Add a "Pro Tip" to the first practice section if it exists.
    const practiceSection = content.sections.find(s => s.type === 'practice');
    if (practiceSection) {
      if (!practiceSection.content.includes('Pro Tip:')) {
        practiceSection.content += "\n\n**Pro Tip:** Repetition is key! Try to use what you've learned in a real conversation today.";
        this.logger.info(`[Enhancer] Added a pro tip to the practice section.`);
      }
    }

    return content;
  }
}
