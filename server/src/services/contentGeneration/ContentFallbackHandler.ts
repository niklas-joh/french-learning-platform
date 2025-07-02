import { IContentFallbackHandler } from './interfaces';
import { ContentRequest, GeneratedContent, StructuredContent, ContentType } from '../../types/Content';
import { generateContentId } from '../../types/Content';
import { ILogger } from '../../types/ILogger';
import * as fs from 'fs';
import * as path from 'path';

export class ContentFallbackHandler implements IContentFallbackHandler {
  private fallbackCache: Map<ContentType, StructuredContent> = new Map();
  private readonly fallbackDir = path.resolve(__dirname, '../../../../content/fallback');

  constructor(private logger: ILogger) {
    this.loadFallbackContent();
  }

  private loadFallbackContent(): void {
    this.logger.info('[ContentFallbackHandler] Loading fallback content from disk...');
    try {
      const fallbackFiles = fs.readdirSync(this.fallbackDir);
      for (const file of fallbackFiles) {
        if (file.endsWith('.json')) {
          // The filename (without extension) must match a ContentType
          const contentType = file.replace('.json', '') as ContentType;
          const filePath = path.join(this.fallbackDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const content = JSON.parse(fileContent) as StructuredContent;
          this.fallbackCache.set(contentType, content);
          this.logger.info(`[ContentFallbackHandler] Loaded fallback for: ${contentType}`);
        }
      }
      this.logger.info('[ContentFallbackHandler] All fallback content loaded successfully.');
    } catch (error) {
      this.logger.error('[ContentFallbackHandler] Failed to load fallback content.', error);
      // We don't throw here, as the handler should be resilient.
    }
  }

  async getFallbackContent(request: ContentRequest, error: Error): Promise<GeneratedContent> {
    this.logger.warn(`[ContentFallbackHandler] Generating fallback content for type '${request.type}' due to error: ${error.message}`);
    
    const specificFallback = this.fallbackCache.get(request.type);

    const contentToUse: StructuredContent = specificFallback || {
      type: request.type,
      title: 'Content Temporarily Unavailable',
      description: 'We encountered an error while generating your content. Please try again later.',
      learningObjectives: [],
      estimatedTime: 5,
    } as any; // Using 'as any' for the generic case.

    if (!specificFallback) {
      this.logger.error(`[ContentFallbackHandler] No specific fallback content found for type '${request.type}'. Using generic fallback.`);
    }

    return {
      id: generateContentId(),
      type: request.type,
      content: contentToUse,
      metadata: {
        userId: request.userId,
        generatedAt: new Date(),
        level: request.level || 'intermediate',
        topics: request.topics || [],
        aiGenerated: false,
        version: '1.0.0-fallback',
        fallback: true,
      },
      validation: {
        isValid: true, // Fallback content is considered valid by default
        score: 100,
        issues: ['Fallback content served due to generation error: ' + error.message],
      },
      estimatedCompletionTime: contentToUse.estimatedTime || 5,
      learningObjectives: contentToUse.learningObjectives || [],
    };
  }

  shouldRetry(error: Error, retryCount: number): boolean {
    // More robust retry logic
    const isTimeout = /timeout/i.test(error.message);
    const isRateLimit = /rate limit/i.test(error.message);
    
    if (retryCount < 2 && (isTimeout || isRateLimit)) {
      this.logger.warn(`[ContentFallbackHandler] Retrying request. Attempt: ${retryCount + 1}. Error: ${error.message}`);
      return true;
    }
    
    this.logger.error(`[ContentFallbackHandler] Not retrying request after ${retryCount} attempts or for non-retriable error.`);
    return false;
  }
}
