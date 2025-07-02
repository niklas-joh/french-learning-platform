import { IContentTemplateManager } from './interfaces';
import { ContentType, LearningContext, ContentTemplate } from '../../types/Content';
import { ILogger } from '../../types/ILogger';
import * as fs from 'fs';
import * as path from 'path';

export class ContentTemplateManager implements IContentTemplateManager {
  private templateCache: Map<ContentType, ContentTemplate> = new Map();
  private readonly templateDir = path.join(__dirname, 'templates');

  constructor(private logger: ILogger) {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    this.logger.info('[ContentTemplateManager] Loading content templates from disk...');
    try {
      const templateFiles = fs.readdirSync(this.templateDir);
      for (const file of templateFiles) {
        if (file.endsWith('.json')) {
          const contentType = file.replace('.json', '') as ContentType;
          const filePath = path.join(this.templateDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const template = JSON.parse(fileContent) as ContentTemplate;
          this.templateCache.set(contentType, template);
          this.logger.info(`[ContentTemplateManager] Loaded template for: ${contentType}`);
        }
      }
      this.logger.info('[ContentTemplateManager] All templates loaded successfully.');
    } catch (error) {
      this.logger.error('[ContentTemplateManager] Failed to load templates.', error);
      throw new Error('Could not load content templates. See logs for details.');
    }
  }

  getTemplate(type: ContentType, context: LearningContext): ContentTemplate {
    const template = this.templateCache.get(type);
    if (!template) {
      this.logger.error(`[ContentTemplateManager] No template found for type: ${type}`);
      // Return a generic, safe default if a template is missing
      return {
        structure: { main: 'default' },
        requirements: {},
        prompts: {
          main: `Generate a ${type} for a user at ${context.currentLevel} level.`,
        },
      };
    }
    return template;
  }
}
