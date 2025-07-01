import { ContentValidator } from '../ContentValidator';
import { ContentRequest, StructuredContent } from '../../../types/Content';

describe('ContentValidator', () => {
  let validator: ContentValidator;

  beforeEach(() => {
    validator = new ContentValidator();
  });

  const createMockRequest = (type: any = 'lesson', level = 'A1'): ContentRequest => ({
    userId: 1,
    type,
    level,
    topics: ['greetings'],
  });

  const createMockContent = (overrides: Partial<StructuredContent> = {}): StructuredContent => ({
    type: 'lesson',
    title: 'Leçon de Salutations',
    description: 'Apprenez les salutations de base en français.',
    learningObjectives: ['Savoir dire bonjour et au revoir', 'Utiliser les salutations formelles et informelles'],
    estimatedTime: 10,
    sections: [
      { type: 'introduction', title: 'Intro', content: '...', duration: 2 },
      { type: 'presentation', title: 'Présentation', content: '...', duration: 5 },
      { type: 'practice', title: 'Pratique', content: '...', duration: 3 },
    ],
    vocabulary: [
      { word: 'Bonjour', definition: 'Hello', pronunciation: 'bon-zhoor', examples: ['Bonjour, comment ça va?'], difficulty: 'easy' },
    ],
    ...overrides,
  });

  it('should validate correctly structured content', async () => {
    const content = createMockContent();
    const request = createMockRequest();
    const validation = await validator.validate(content, request);
    expect(validation.isValid).toBe(true);
    expect(validation.score).toBeGreaterThan(0.7);
  });

  it('should invalidate content with missing title', async () => {
    const content = createMockContent({ title: '' });
    const request = createMockRequest();
    const validation = await validator.validate(content, request);
    expect(validation.isValid).toBe(false);
    expect(validation.issues).toContain('Missing or empty title');
  });

  it('should invalidate content with insufficient French language elements', async () => {
    const content = createMockContent({ title: 'Greetings Lesson', description: 'Learn basic greetings.' });
    const request = createMockRequest();
    const validation = await validator.validate(content, request);
    expect(validation.issues).toContain('Content may not contain sufficient French language elements');
  });

  it('should validate a grammar exercise with correct structure', async () => {
    const content = {
      type: 'grammar_exercise',
      title: 'Le Passé Composé',
      description: 'Learn the passé composé tense.',
      learningObjectives: ['Form the passé composé with avoir'],
      estimatedTime: 15,
      grammarRule: 'passé composé',
      explanation: 'The passé composé is formed with...',
      examples: ['J\'ai mangé', 'Tu as parlé'],
      exercises: [{ type: 'fill_in_blank', instruction: '...', items: [], feedback: '...' }],
    };
    const request = createMockRequest('grammar_exercise');
    const validation = await validator.validate(content, request);
    expect(validation.isValid).toBe(true);
  });

  it('should invalidate a grammar exercise with missing explanation', async () => {
    const content = {
      type: 'grammar_exercise',
      title: 'Le Passé Composé',
      description: 'Learn the passé composé tense.',
      learningObjectives: ['Form the passé composé with avoir'],
      estimatedTime: 15,
      grammarRule: 'passé composé',
      explanation: '',
      examples: ['J\'ai mangé', 'Tu as parlé'],
      exercises: [{ type: 'fill_in_blank', instruction: '...', items: [], feedback: '...' }],
    };
    const request = createMockRequest('grammar_exercise');
    const validation = await validator.validate(content, request);
    expect(validation.isValid).toBe(false);
    expect(validation.issues).toContain('Missing grammar rule explanation');
  });
});
