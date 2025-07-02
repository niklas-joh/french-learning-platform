import { IContentEnhancerFactory, IContentEnhancer } from './interfaces';
import { ContentType, LearningContext } from '../../types/Content';
import { ILogger } from '../../types/ILogger';
import { LessonEnhancer } from './enhancers/LessonEnhancer';

export class ContentEnhancerFactory implements IContentEnhancerFactory {
  private enhancers: Map<ContentType, IContentEnhancer>;

  constructor(private logger: ILogger) {
    this.enhancers = new Map<ContentType, IContentEnhancer>([
      ['lesson', new LessonEnhancer(this.logger)],
      // Future enhancers for other content types can be added here
    ]);
    this.logger.info('[ContentEnhancerFactory] Initialized with enhancers for:', [...this.enhancers.keys()]);
  }

  getEnhancer(type: ContentType): IContentEnhancer {
    const enhancer = this.enhancers.get(type);
    if (!enhancer) {
      this.logger.warn(`[ContentEnhancerFactory] No enhancer found for content type: '${type}'. Using a default pass-through enhancer.`);
      // Return a default enhancer that does nothing
      return {
        enhance: (content: any, context: LearningContext) => Promise.resolve(content)
      };
    }
    this.logger.info(`[ContentEnhancerFactory] Providing enhancer for type: '${type}'`);
    return enhancer;
  }
}
