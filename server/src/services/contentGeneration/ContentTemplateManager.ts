import { IContentTemplateManager } from './interfaces';
import { ContentType, LearningContext, ContentTemplate } from '../../types/Content';

export class ContentTemplateManager implements IContentTemplateManager {
  getTemplate(type: ContentType, context: LearningContext): ContentTemplate {
    return {
      structure: { main: 'default' },
      requirements: { min_length: 100 },
      prompts: {
        main: `Generate a ${type} for a user at ${context.currentLevel} level.`
      }
    };
  }
}
