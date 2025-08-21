/**
 * Unit Tests for MultipleChoiceStrategy
 * 
 * Tests the multiple choice assessment strategy implementation including:
 * - Basic string comparison functionality
 * - Normalization handling
 * - Feedback generation
 * - Error handling and fallback behavior
 */

import { MultipleChoiceStrategy } from '../strategies/multipleChoiceStrategy.js';
import { AssessmentRequest } from '../../../../types/Assessment.js';

describe('MultipleChoiceStrategy', () => {
  let strategy: MultipleChoiceStrategy;
  let mockRequest: AssessmentRequest;

  beforeEach(() => {
    strategy = new MultipleChoiceStrategy();
    mockRequest = {
      userId: 1,
      userResponse: 'A',
      expectedAnswer: 'A',
      responseType: 'multiple-choice',
      context: {
        userId: 1,
        skillArea: 'vocabulary',
        userLevel: 'A1'
      }
    };
  });

  describe('assess', () => {
    it('should return correct assessment for matching answers', async () => {
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
      expect(result.confidence).toBe('high');
      expect(result.assessmentType).toBe('multiple-choice');
      expect(result.feedback.tone).toBe('congratulatory');
      expect(result.feedback.message).toContain('correct');
    });

    it('should return incorrect assessment for non-matching answers', async () => {
      mockRequest.userResponse = 'B';
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
      expect(result.confidence).toBe('high');
      expect(result.assessmentType).toBe('multiple-choice');
      expect(result.feedback.tone).toBe('encouraging');
      expect(result.feedback.message).toContain('Not quite');
      expect(result.feedback.suggestions).toHaveLength(2);
    });

    it('should handle case-insensitive comparison', async () => {
      mockRequest.userResponse = 'a';
      mockRequest.expectedAnswer = 'A';
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should handle whitespace normalization', async () => {
      mockRequest.userResponse = '  A  ';
      mockRequest.expectedAnswer = 'A';
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should handle special characters in normalization', async () => {
      mockRequest.userResponse = 'A.';
      mockRequest.expectedAnswer = 'A';
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
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
      mockRequest.expectedAnswer = undefined as any;
      
      const result = await strategy.assess(mockRequest);

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
      expect(result.isFallback).toBe(true);
      expect(result.feedback.tone).toBe('neutral');
    });

    it('should include processing time in result', async () => {
      const result = await strategy.assess(mockRequest);

      expect(result.processingTime).toBeDefined();
      expect(typeof result.processingTime).toBe('number');
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should include user response in result', async () => {
      const result = await strategy.assess(mockRequest);

      expect(result.userResponse).toBe(mockRequest.userResponse);
    });
  });

  describe('normalization', () => {
    it('should normalize strings consistently', async () => {
      const testCases = [
        { input: 'A', expected: 'a' },
        { input: '  A  ', expected: 'a' },
        { input: 'A.', expected: 'a' },
        { input: 'A!', expected: 'a' },
        { input: 'Hello World!', expected: 'hello world' }
      ];

      for (const testCase of testCases) {
        mockRequest.userResponse = testCase.input;
        mockRequest.expectedAnswer = testCase.expected;
        
        const result = await strategy.assess(mockRequest);
        expect(result.isCorrect).toBe(true);
      }
    });
  });
});