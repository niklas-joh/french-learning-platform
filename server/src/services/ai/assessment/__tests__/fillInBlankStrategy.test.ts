/**
 * Unit Tests for FillInBlankStrategy
 * 
 * Tests the fill-in-blank assessment strategy implementation including:
 * - French language similarity analysis
 * - Cultural feedback generation
 * - French-specific normalization (accents, gender, liaisons)
 * - Error handling and fallback behavior
 */

import { FillInBlankStrategy } from '../strategies/fillInBlankStrategy.js';
import { AssessmentRequest } from '../../../../types/Assessment.js';

// Mock the FrenchLanguageUtils
jest.mock('../utils/FrenchLanguageUtils.js', () => ({
  frenchUtils: {
    calculateSimilarity: jest.fn()
  }
}));

import { frenchUtils } from '../utils/FrenchLanguageUtils.js';

describe('FillInBlankStrategy', () => {
  let strategy: FillInBlankStrategy;
  let mockRequest: AssessmentRequest;
  let mockSimilarity: any;

  beforeEach(() => {
    strategy = new FillInBlankStrategy();
    mockRequest = {
      userId: 1,
      userResponse: 'le chat',
      expectedAnswer: 'le chat',
      responseType: 'fill-in-blank',
      context: {
        userId: 1,
        skillArea: 'grammar',
        userLevel: 'A1'
      }
    };

    mockSimilarity = {
      overall: 0.9,
      confidence: 'high',
      phonetic: 0.85,
      semantic: 0.95,
      structural: 0.9,
      details: {
        accentHandled: false,
        genderVariationAllowed: false,
        liaisonConsidered: false
      }
    };

    (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('assess', () => {
    it('should return correct assessment for high similarity', async () => {
      const result = await strategy.assess(mockRequest);

      expect(frenchUtils.calculateSimilarity).toHaveBeenCalledWith('le chat', 'le chat');
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(90);
      expect(result.confidence).toBe('high');
      expect(result.assessmentType).toBe('fill-in-blank');
      expect(result.feedback.tone).toBe('congratulatory');
      expect(result.feedback.message).toContain('Excellent');
    });

    it('should return incorrect assessment for low similarity', async () => {
      mockSimilarity.overall = 0.6;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(60);
      expect(result.feedback.tone).toBe('encouraging');
      expect(result.feedback.message).toContain('Presque');
    });

    it('should include French similarity metadata', async () => {
      const result = await strategy.assess(mockRequest);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.frenchSimilarityDetails).toEqual(mockSimilarity.details);
      expect(result.metadata?.phoneticSimilarity).toBe(mockSimilarity.phonetic);
      expect(result.metadata?.semanticSimilarity).toBe(mockSimilarity.semantic);
      expect(result.metadata?.structuralSimilarity).toBe(mockSimilarity.structural);
    });

    it('should provide accent-specific feedback when accents are handled', async () => {
      mockSimilarity.details.accentHandled = true;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.encouragement).toContain('accents français');
    });

    it('should provide gender-specific feedback when gender variation is detected', async () => {
      mockSimilarity.details.genderVariationAllowed = true;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.encouragement).toContain('accords de genre');
    });

    it('should provide liaison-specific feedback when liaisons are considered', async () => {
      mockSimilarity.details.liaisonConsidered = true;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.encouragement).toContain('contractions françaises');
    });

    it('should provide specific suggestions for low accuracy with accent issues', async () => {
      mockSimilarity.overall = 0.5;
      mockSimilarity.details.accentHandled = true;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.suggestions).toContain('Attention aux accents français (é, è, à, ç, etc.)');
      expect(result.feedback.grammarTip).toContain('accents changent la prononciation');
    });

    it('should provide gender-specific suggestions for gender issues', async () => {
      mockSimilarity.overall = 0.5;
      mockSimilarity.details.genderVariationAllowed = true;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.suggestions).toContain('Vérifiez l\'accord en genre (masculin/féminin)');
      expect(result.feedback.grammarTip).toContain('adjectifs s\'accordent avec le genre');
    });

    it('should provide liaison-specific suggestions for contraction issues', async () => {
      mockSimilarity.overall = 0.5;
      mockSimilarity.details.liaisonConsidered = true;
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.suggestions).toContain('Attention aux contractions (l\', d\', c\', etc.)');
      expect(result.feedback.grammarTip).toContain('contractions sont courantes');
    });

    it('should provide level-appropriate suggestions for A1/A2 users', async () => {
      mockSimilarity.overall = 0.5;
      mockRequest.context.userLevel = 'A1';
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.suggestions).toContain('Révisez le vocabulaire de base');
      expect(result.feedback.suggestions).toContain('Pratiquez la conjugaison des verbes courants');
    });

    it('should provide level-appropriate suggestions for higher level users', async () => {
      mockSimilarity.overall = 0.5;
      mockRequest.context.userLevel = 'B1';
      (frenchUtils.calculateSimilarity as jest.Mock).mockReturnValue(mockSimilarity);
      
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.suggestions).toContain('Révisez les règles grammaticales');
      expect(result.feedback.suggestions).toContain('Pratiquez avec des textes authentiques');
    });

    it('should include cultural notes based on user level', async () => {
      const result = await strategy.assess(mockRequest);

      expect(result.feedback.culturalNote).toBeDefined();
      expect(typeof result.feedback.culturalNote).toBe('string');
      expect(result.feedback.culturalNote!.length).toBeGreaterThan(0);
    });

    it('should handle AbortSignal cancellation', async () => {
      const abortController = new AbortController();
      abortController.abort();

      await expect(strategy.assess(mockRequest, { signal: abortController.signal }))
        .rejects.toThrow('Assessment request was cancelled');
    });

    it('should return fallback for invalid user response', async () => {
      mockRequest.userResponse = null as any;
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
      expect(result.isFallback).toBe(true);
      expect(result.feedback.tone).toBe('neutral');
    });

    it('should return fallback for invalid expected answer', async () => {
      mockRequest.expectedAnswer = null as any;
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
      expect(result.isFallback).toBe(true);
      expect(result.feedback.tone).toBe('neutral');
    });

    it('should handle errors and return fallback', async () => {
      (frenchUtils.calculateSimilarity as jest.Mock).mockImplementation(() => {
        throw new Error('French utils error');
      });
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
      expect(result.isFallback).toBe(true);
      expect(result.processingTime).toBeDefined();
    });

    it('should include processing time in result', async () => {
      const result = await strategy.assess(mockRequest);

      expect(result.processingTime).toBeDefined();
      expect(typeof result.processingTime).toBe('number');
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('cultural notes', () => {
    it('should provide A1 level cultural notes', async () => {
      mockRequest.context.userLevel = 'A1';
      
      const result = await strategy.assess(mockRequest);

      const culturalNote = result.feedback.culturalNote!;
      expect(['Bonjour', 'contractions', 'masculin et féminin'].some(word => 
        culturalNote.includes(word)
      )).toBe(true);
    });

    it('should provide A2 level cultural notes', async () => {
      mockRequest.context.userLevel = 'A2';
      
      const result = await strategy.assess(mockRequest);

      const culturalNote = result.feedback.culturalNote!;
      expect(['accent aigu', 'accent grave', 'j\'suis', 'prononcer'].some(word => 
        culturalNote.includes(word)
      )).toBe(true);
    });

    it('should provide B1 level cultural notes', async () => {
      mockRequest.context.userLevel = 'B1';
      
      const result = await strategy.assess(mockRequest);

      const culturalNote = result.feedback.culturalNote!;
      expect(['subjonctif', 'liaisons', 'région'].some(word => 
        culturalNote.includes(word)
      )).toBe(true);
    });
  });
});