import { IContentEnhancerFactory, IContentEnhancer } from './interfaces';
import { ContentType, LearningContext } from '../../types/Content';

class StubEnhancer implements IContentEnhancer {
  enhance(content: any, context: LearningContext): Promise<any> {
    return Promise.resolve(content);
  }
}

export class ContentEnhancerFactory implements IContentEnhancerFactory {
  getEnhancer(type: ContentType): IContentEnhancer {
    return new StubEnhancer();
  }
}
