/**
 * Unit Tests for AI Controller Validation Schemas
 * 
 * Tests the Zod validation schemas to ensure they correctly validate
 * request payloads and provide helpful error messages for invalid data.
 */

import {
  generateLessonPayloadSchema,
  assessPronunciationPayloadSchema,
  gradeResponsePayloadSchema
} from '../ai.validators';
import { TestDataFactory, TestHelpers } from './mocks';

describe('AI Controller Validation Schemas', () => {
  beforeEach(() => {
    // Ensure clean state between tests
    jest.clearAllMocks();
  });

  describe('generateLessonPayloadSchema', () => {
    describe('valid payloads', () => {
      it('should validate a complete valid payload', () => {
        const validPayload = TestDataFactory.createGenerateLessonPayload();
        const result = generateLessonPayloadSchema.safeParse(validPayload);
        
        expect(result.success).toBe(true);
        if (result.success) {
        expect(result.data.topic).toBe(validPayload.topic);
        expect(result.data.level).toBe(validPayload.level);
        expect(result.data.duration).toBe(validPayload.duration);
        }
      });

      it('should validate payload with minimal required fields', () => {
        const minimalPayload = TestDataFactory.createGenerateLessonPayload({
          duration: undefined // Optional field
        });
        const result = generateLessonPayloadSchema.safeParse(minimalPayload);
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.topic).toBe(minimalPayload.topic);
          expect(result.data.level).toBe(minimalPayload.level);
        }
      });

      it('should validate all CEFR levels', () => {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
        
        levels.forEach(level => {
          const payload = TestDataFactory.createGenerateLessonPayload({ level });
          const result = generateLessonPayloadSchema.safeParse(payload);
          
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data.level).toBe(level);
          }
        });
      });
    });

    describe('invalid payloads', () => {
      it('should reject payload with missing topic', () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.missingRequiredField('topic');
        const result = generateLessonPayloadSchema.safeParse(invalidPayload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['topic']),
                code: 'invalid_type'
              })
            ])
          );
        }
      });

      it('should reject payload with missing level', () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.missingRequiredField('level');
        const result = generateLessonPayloadSchema.safeParse(invalidPayload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['level']),
                code: 'invalid_type'
              })
            ])
          );
        }
      });

      it('should reject payload with empty topic string', () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.emptyString('topic');
        const result = generateLessonPayloadSchema.safeParse(invalidPayload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['topic']),
                code: 'too_small'
              })
            ])
          );
        }
      });

      it('should reject payload with invalid level value', () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.invalidFieldType('level', 'expert');
        const result = generateLessonPayloadSchema.safeParse(invalidPayload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['level']),
                code: 'invalid_enum_value'
              })
            ])
          );
        }
      });

      it('should reject payload with topic that is too long', () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.tooLongString('topic', 200);
        const result = generateLessonPayloadSchema.safeParse(invalidPayload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['topic']),
                code: 'too_big'
              })
            ])
          );
        }
      });

      it('should reject payload with invalid duration (below minimum)', () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.invalidFieldType('duration', 3);
        const result = generateLessonPayloadSchema.safeParse(invalidPayload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['duration']),
                code: 'too_small'
              })
            ])
          );
        }
      });
    });
  });

  describe('assessPronunciationPayloadSchema', () => {
    describe('valid payloads', () => {
      it('should validate a complete valid payload', () => {
        const validPayload = TestDataFactory.createAssessPronunciationPayload();
        const result = assessPronunciationPayloadSchema.safeParse(validPayload);
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.audioUrl).toBe(validPayload.audioUrl);
          expect(result.data.expectedPhrase).toBe(validPayload.expectedPhrase);
        }
      });

      it('should validate payload with different URL protocols', () => {
        const protocols = ['https://example.com/audio.wav', 'http://example.com/audio.mp3'];
        
        protocols.forEach(audioUrl => {
          const payload = TestDataFactory.createAssessPronunciationPayload({ audioUrl });
          const result = assessPronunciationPayloadSchema.safeParse(payload);
          
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data.audioUrl).toBe(audioUrl);
          }
        });
      });
    });

    describe('invalid payloads', () => {
      it('should reject payload with missing audioUrl', () => {
        const payload = TestDataFactory.createAssessPronunciationPayload();
        delete (payload as any).audioUrl;
        const result = assessPronunciationPayloadSchema.safeParse(payload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['audioUrl']),
                code: 'invalid_type'
              })
            ])
          );
        }
      });

      it('should reject payload with invalid URL format', () => {
        const payload = TestDataFactory.createAssessPronunciationPayload({
          audioUrl: 'not-a-valid-url'
        });
        const result = assessPronunciationPayloadSchema.safeParse(payload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['audioUrl']),
                code: 'invalid_string'
              })
            ])
          );
        }
      });

      it('should reject payload with empty expectedPhrase', () => {
        const payload = TestDataFactory.createAssessPronunciationPayload({
          expectedPhrase: ''
        });
        const result = assessPronunciationPayloadSchema.safeParse(payload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['expectedPhrase']),
                code: 'too_small'
              })
            ])
          );
        }
      });
    });
  });

  describe('gradeResponsePayloadSchema', () => {
    describe('valid payloads', () => {
      it('should validate a complete valid payload', () => {
        const validPayload = TestDataFactory.createGradeResponsePayload();
        const result = gradeResponsePayloadSchema.safeParse(validPayload);
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.userResponse).toBe(validPayload.userResponse);
          expect(result.data.correctAnswer).toBe(validPayload.correctAnswer);
          expect(result.data.questionType).toBe(validPayload.questionType);
        }
      });

      it('should validate all question types', () => {
        const questionTypes = ['multiple_choice', 'fill_blank', 'translation', 'essay'] as const;
        
        questionTypes.forEach(questionType => {
          const payload = TestDataFactory.createGradeResponsePayload({ questionType });
          const result = gradeResponsePayloadSchema.safeParse(payload);
          
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data.questionType).toBe(questionType);
          }
        });
      });
    });

    describe('invalid payloads', () => {
      it('should reject payload with missing userResponse', () => {
        const payload = TestDataFactory.createGradeResponsePayload();
        delete (payload as any).userResponse;
        const result = gradeResponsePayloadSchema.safeParse(payload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['userResponse']),
                code: 'invalid_type'
              })
            ])
          );
        }
      });

      it('should reject payload with invalid questionType', () => {
        const payload = TestDataFactory.createGradeResponsePayload({
          questionType: 'invalid_type' as any
        });
        const result = gradeResponsePayloadSchema.safeParse(payload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['questionType']),
                code: 'invalid_enum_value'
              })
            ])
          );
        }
      });

      it('should reject payload with empty correctAnswer', () => {
        const payload = TestDataFactory.createGradeResponsePayload({
          correctAnswer: ''
        });
        const result = gradeResponsePayloadSchema.safeParse(payload);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: expect.arrayContaining(['correctAnswer']),
                code: 'too_small'
              })
            ])
          );
        }
      });
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle Unicode characters in text fields', () => {
      const unicodePayload = TestDataFactory.createGenerateLessonPayload({
        topic: 'Les émotions françaises 🇫🇷'
      });
      const result = generateLessonPayloadSchema.safeParse(unicodePayload);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.topic).toBe('Les émotions françaises 🇫🇷');
      }
    });

    it('should handle maximum valid string lengths', () => {
      const maxLengthPayload = TestDataFactory.createGenerateLessonPayload({
        topic: 'A'.repeat(100) // Max length is 100 based on validator
      });
      const result = generateLessonPayloadSchema.safeParse(maxLengthPayload);
      
      expect(result.success).toBe(true);
    });

    it('should handle boundary values for duration', () => {
      const boundaryPayload = TestDataFactory.createGenerateLessonPayload({
        duration: 5 // Minimum valid value based on validator
      });
      const result = generateLessonPayloadSchema.safeParse(boundaryPayload);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.duration).toBe(5);
      }
    });
  });
});
