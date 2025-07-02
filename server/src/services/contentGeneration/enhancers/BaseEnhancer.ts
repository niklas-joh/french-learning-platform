import { IContentEnhancer } from '../interfaces';
import { ContentType, LearningContext } from '../../../types/Content';
import { ILogger } from '../../../types/ILogger';

/**
 * Abstract base class for content enhancers.
 * Provides a consistent structure for all enhancer implementations.
 */
export abstract class BaseEnhancer implements IContentEnhancer {
  protected abstract readonly contentType: ContentType;

  constructor(protected logger: ILogger) {}

  /**
   * Abstract method to be implemented by concrete enhancer classes.
   * @param content - The content to enhance, specific to the content type.
   * @param context - The user's learning context.
   * @returns A promise that resolves to the enhanced content.
   */
  abstract enhance(content: any, context: LearningContext): Promise<any>;
}
