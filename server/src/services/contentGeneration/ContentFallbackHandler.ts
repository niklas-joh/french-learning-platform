import { IContentFallbackHandler } from './interfaces';
import { ContentRequest, GeneratedContent, StructuredContent } from '../../types/Content';
import { generateContentId } from '../../types/Content';

export class ContentFallbackHandler implements IContentFallbackHandler {
  async getFallbackContent(request: ContentRequest, error: Error): Promise<GeneratedContent> {
    const fallbackContent: StructuredContent = {
      type: request.type,
      title: 'Content Temporarily Unavailable',
      description: 'We encountered an error while generating your content. Please try again later.',
      learningObjectives: [],
      estimatedTime: 5,
    } as any; // Using as any for stub

    return {
      id: generateContentId(),
      type: request.type,
      content: fallbackContent,
      metadata: {
        userId: request.userId,
        generatedAt: new Date(),
        level: request.level || 'intermediate',
        topics: request.topics || [],
        aiGenerated: false,
        version: '1.0',
        fallback: true,
      },
      validation: {
        isValid: false,
        score: 0,
        issues: ['Fallback content due to generation error: ' + error.message],
      },
      estimatedCompletionTime: 5,
      learningObjectives: [],
    };
  }

  shouldRetry(error: Error, retryCount: number): boolean {
    // Simple retry logic: retry for non-critical errors up to 2 times.
    if (retryCount < 2 && !error.message.includes('critical')) {
      return true;
    }
    return false;
  }
}
