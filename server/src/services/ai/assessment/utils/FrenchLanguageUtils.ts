/**
 * @file French Language Utilities for Assessment Processing
 * @description Provides French-specific language processing capabilities including
 * accent handling, phonetic similarity, and cultural context awareness.
 */

import { FrenchSimilarityScore, FrenchLevel, ConfidenceLevel } from '../../../../types/Assessment.js';
import { ILogger, createLogger } from '../../../../utils/logger.js';

/**
 * Interface for French language processing utilities
 */
export interface IFrenchUtils {
  normalizeForComparison(text: string): string;
  calculateSimilarity(answer: string, expected: string): FrenchSimilarityScore;
  handleAccentVariations(text: string): string[];
  isValidFrenchResponse(text: string, level: FrenchLevel): boolean;
}

/**
 * @class FrenchLanguageUtils
 * @description Comprehensive French language processing utilities for assessment
 * Handles accents, liaisons, gender variations, and cultural context
 */
export class FrenchLanguageUtils implements IFrenchUtils {
  private readonly logger: ILogger;

  // French accent mappings for normalization
  private readonly accentMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'ā': 'a', 'ă': 'a', 'ą': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e', 'ĕ': 'e', 'ę': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ī': 'i', 'ĭ': 'i', 'į': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ō': 'o', 'ŏ': 'o', 'ő': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ū': 'u', 'ŭ': 'u', 'ů': 'u', 'ű': 'u', 'ų': 'u',
    'ç': 'c', 'ć': 'c', 'ĉ': 'c', 'ċ': 'c', 'č': 'c',
    'ñ': 'n', 'ń': 'n', 'ň': 'n', 'ņ': 'n',
    'ÿ': 'y', 'ý': 'y', 'ŷ': 'y'
  };

  // Common French contractions and liaisons
  private readonly contractions: Record<string, string[]> = {
    "l'": ['le ', 'la '],
    "d'": ['de '],
    "c'": ['ce '],
    "s'": ['se '],
    "n'": ['ne '],
    "m'": ['me '],
    "t'": ['te '],
    "j'": ['je ']
  };

  // Gender variations for common French words
  private readonly genderVariations: Record<string, string[]> = {
    'bon': ['bon', 'bonne'],
    'grand': ['grand', 'grande'],
    'petit': ['petit', 'petite'],
    'nouveau': ['nouveau', 'nouvelle'],
    'beau': ['beau', 'belle'],
    'français': ['français', 'française'],
    'content': ['content', 'contente'],
    'heureux': ['heureux', 'heureuse']
  };

  constructor() {
    this.logger = createLogger('FrenchLanguageUtils');
  }

  /**
   * Normalizes French text for comparison by handling accents, case, and punctuation
   * @param text The text to normalize
   * @returns Normalized text suitable for comparison
   */
  public normalizeForComparison(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    let normalized = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s']/g, '') // Keep apostrophes for contractions
      .replace(/\s+/g, ' '); // Normalize whitespace

    // Remove accents using Unicode decomposition
    normalized = normalized
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics

    // Handle specific French accent cases
    Object.entries(this.accentMap).forEach(([accented, plain]) => {
      normalized = normalized.replace(new RegExp(accented, 'g'), plain);
    });

    return normalized;
  }

  /**
   * Calculates similarity between French text responses with language-specific considerations
   * @param answer User's answer
   * @param expected Expected answer
   * @returns Detailed similarity score with French language analysis
   */
  public calculateSimilarity(answer: string, expected: string): FrenchSimilarityScore {
    const startTime = Date.now();
    
    const normalizedAnswer = this.normalizeForComparison(answer);
    const normalizedExpected = this.normalizeForComparison(expected);

    // Exact match after normalization
    if (normalizedAnswer === normalizedExpected) {
      return {
        overall: 1.0,
        phonetic: 1.0,
        semantic: 1.0,
        structural: 1.0,
        confidence: 'high',
        details: {
          accentHandled: this.hasAccents(answer) || this.hasAccents(expected),
          liaisonConsidered: this.hasContractions(answer) || this.hasContractions(expected),
          genderVariationAllowed: false
        }
      };
    }

    // Check for gender variations
    const genderSimilarity = this.checkGenderVariations(normalizedAnswer, normalizedExpected);
    if (genderSimilarity > 0.9) {
      return {
        overall: genderSimilarity,
        phonetic: 0.95,
        semantic: 1.0,
        structural: 0.9,
        confidence: 'high',
        details: {
          accentHandled: true,
          liaisonConsidered: false,
          genderVariationAllowed: true
        }
      };
    }

    // Check for contraction variations
    const contractionSimilarity = this.checkContractionVariations(normalizedAnswer, normalizedExpected);
    if (contractionSimilarity > 0.8) {
      return {
        overall: contractionSimilarity,
        phonetic: 0.85,
        semantic: 0.9,
        structural: 0.95,
        confidence: 'medium',
        details: {
          accentHandled: false,
          liaisonConsidered: true,
          genderVariationAllowed: false
        }
      };
    }

    // Levenshtein distance for general similarity
    const levenshteinSimilarity = this.calculateLevenshteinSimilarity(normalizedAnswer, normalizedExpected);
    
    // Phonetic similarity (simplified French phonetics)
    const phoneticSimilarity = this.calculatePhoneticSimilarity(normalizedAnswer, normalizedExpected);

    // Structural similarity (word order, length)
    const structuralSimilarity = this.calculateStructuralSimilarity(normalizedAnswer, normalizedExpected);

    const overall = (levenshteinSimilarity + phoneticSimilarity + structuralSimilarity) / 3;
    
    const confidence: ConfidenceLevel = overall > 0.8 ? 'high' : overall > 0.6 ? 'medium' : 'low';

    this.logger.debug(`French similarity calculation completed in ${Date.now() - startTime}ms`, {
      answer: normalizedAnswer,
      expected: normalizedExpected,
      overall,
      confidence
    });

    return {
      overall,
      phonetic: phoneticSimilarity,
      semantic: levenshteinSimilarity,
      structural: structuralSimilarity,
      confidence,
      details: {
        accentHandled: this.hasAccents(answer) || this.hasAccents(expected),
        liaisonConsidered: this.hasContractions(answer) || this.hasContractions(expected),
        genderVariationAllowed: genderSimilarity > 0.5
      }
    };
  }

  /**
   * Generates accent variations for a given French text
   * @param text The text to generate variations for
   * @returns Array of possible accent variations
   */
  public handleAccentVariations(text: string): string[] {
    const variations = [text];
    
    // Add version without accents
    const withoutAccents = this.normalizeForComparison(text);
    if (withoutAccents !== text.toLowerCase()) {
      variations.push(withoutAccents);
    }

    // Add common accent variations
    let withAccents = text;
    const commonAccentPatterns = [
      { pattern: /e/g, replacement: 'é' },
      { pattern: /a/g, replacement: 'à' },
      { pattern: /u/g, replacement: 'ù' },
      { pattern: /c/g, replacement: 'ç' }
    ];

    commonAccentPatterns.forEach(({ pattern, replacement }) => {
      const variation = text.replace(pattern, replacement);
      if (variation !== text && !variations.includes(variation)) {
        variations.push(variation);
      }
    });

    return variations;
  }

  /**
   * Validates if a response is appropriate for the given French proficiency level
   * @param text The response text
   * @param level The user's French proficiency level
   * @returns Whether the response is valid for the level
   */
  public isValidFrenchResponse(text: string, level: FrenchLevel): boolean {
    if (!text || text.trim().length === 0) {
      return false;
    }

    const wordCount = text.trim().split(/\s+/).length;
    const avgWordLength = text.replace(/\s+/g, '').length / wordCount;

    // Level-appropriate complexity checks
    switch (level) {
      case 'A1':
        return wordCount <= 5 && avgWordLength <= 6;
      case 'A2':
        return wordCount <= 10 && avgWordLength <= 7;
      case 'B1':
        return wordCount <= 20 && avgWordLength <= 8;
      case 'B2':
        return wordCount <= 30 && avgWordLength <= 9;
      case 'C1':
      case 'C2':
        return true; // No restrictions at advanced levels
      default:
        return true;
    }
  }

  /**
   * Checks if text contains French accents
   * @private
   */
  private hasAccents(text: string): boolean {
    return /[àáâãäéèêëïíîìöóôòõüúûùñç]/i.test(text);
  }

  /**
   * Checks if text contains French contractions
   * @private
   */
  private hasContractions(text: string): boolean {
    return /[ljdcsnmt]'/i.test(text);
  }

  /**
   * Checks similarity considering gender variations
   * @private
   */
  private checkGenderVariations(answer: string, expected: string): number {
    for (const [base, variations] of Object.entries(this.genderVariations)) {
      if (variations.some(v => answer.includes(v)) && variations.some(v => expected.includes(v))) {
        return 0.95; // High similarity for gender variations
      }
    }
    return 0;
  }

  /**
   * Checks similarity considering contraction variations
   * @private
   */
  private checkContractionVariations(answer: string, expected: string): number {
    for (const [contraction, expansions] of Object.entries(this.contractions)) {
      const answerHasContraction = answer.includes(contraction);
      const expectedHasExpansion = expansions.some(exp => expected.includes(exp));
      
      if (answerHasContraction && expectedHasExpansion) {
        return 0.85; // Good similarity for contraction variations
      }
    }
    return 0;
  }

  /**
   * Calculates Levenshtein similarity between two strings
   * @private
   */
  private calculateLevenshteinSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitution = matrix[j - 1][i - 1] + 
          (str1[i - 1] === str2[j - 1] ? 0 : 1);
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          substitution // substitution
        );
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  /**
   * Calculates phonetic similarity using simplified French phonetics
   * @private
   */
  private calculatePhoneticSimilarity(str1: string, str2: string): number {
    // Simplified French phonetic mappings
    const phoneticMap: Record<string, string> = {
      'ph': 'f', 'ch': 'sh', 'qu': 'k', 'ou': 'u', 'eau': 'o', 
      'au': 'o', 'ai': 'e', 'ei': 'e', 'oi': 'wa'
    };

    let phonetic1 = str1;
    let phonetic2 = str2;

    Object.entries(phoneticMap).forEach(([pattern, replacement]) => {
      phonetic1 = phonetic1.replace(new RegExp(pattern, 'g'), replacement);
      phonetic2 = phonetic2.replace(new RegExp(pattern, 'g'), replacement);
    });

    return this.calculateLevenshteinSimilarity(phonetic1, phonetic2);
  }

  /**
   * Calculates structural similarity (word count, length ratios)
   * @private
   */
  private calculateStructuralSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\s+/).filter(w => w.length > 0);
    const words2 = str2.split(/\s+/).filter(w => w.length > 0);

    const wordCountSimilarity = 1 - Math.abs(words1.length - words2.length) / Math.max(words1.length, words2.length, 1);
    const lengthSimilarity = 1 - Math.abs(str1.length - str2.length) / Math.max(str1.length, str2.length, 1);

    return (wordCountSimilarity + lengthSimilarity) / 2;
  }

  /**
   * Identifies common French language patterns in user responses for weakness analysis.
   * Analyzes text patterns to identify specific French language challenges.
   * 
   * @param {string[]} responses - Array of user responses to analyze
   * @returns {Record<string, number>} Pattern counts for weakness analysis
   */
  public identifyCommonPatterns(responses: string[]): Record<string, number> {
    const patterns: Record<string, number> = {};
    
    responses.forEach(response => {
      const normalizedResponse = response.toLowerCase().trim();
      
      // Accent-related patterns
      if (!this.hasAccents(normalizedResponse) && this.shouldHaveAccents(normalizedResponse)) {
        patterns['missing_accents'] = (patterns['missing_accents'] || 0) + 1;
      }
      
      // Gender agreement patterns (simplified heuristic)
      if (this.hasGenderAgreementIssues(normalizedResponse)) {
        patterns['gender_agreement'] = (patterns['gender_agreement'] || 0) + 1;
      }
      
      // Contraction usage patterns
      if (this.hasContractionIssues(normalizedResponse)) {
        patterns['contraction_errors'] = (patterns['contraction_errors'] || 0) + 1;
      }
      
      // Verb conjugation patterns (basic detection)
      if (this.hasVerbConjugationIssues(normalizedResponse)) {
        patterns['verb_conjugation'] = (patterns['verb_conjugation'] || 0) + 1;
      }
      
      // Article usage patterns
      if (this.hasArticleIssues(normalizedResponse)) {
        patterns['article_usage'] = (patterns['article_usage'] || 0) + 1;
      }
    });
    
    return patterns;
  }

  /**
   * Checks if text should contain accents but doesn't
   * @private
   */
  private shouldHaveAccents(text: string): boolean {
    // Common French words that should have accents
    const wordsNeedingAccents = ['etre', 'avoir', 'faire', 'aller', 'ecole', 'francais', 'pere', 'mere'];
    return wordsNeedingAccents.some(word => text.includes(word));
  }

  /**
   * Basic detection of gender agreement issues
   * @private  
   */
  private hasGenderAgreementIssues(text: string): boolean {
    // Very simplified detection - could be enhanced with NLP
    const masculineArticles = ['le', 'un', 'du', 'au'];
    const feminineArticles = ['la', 'une', 'de la', 'à la'];
    const commonMismatchPatterns = [
      /le\s+maison/, // should be "la maison"
      /un\s+école/, // should be "une école"
      /la\s+livre/   // should be "le livre"
    ];
    
    return commonMismatchPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Detects contraction usage issues
   * @private
   */
  private hasContractionIssues(text: string): boolean {
    // Check for missing contractions
    const shouldContract = [
      /de\s+le/, // should be "du"
      /à\s+le/,  // should be "au"  
      /de\s+les/, // should be "des"
      /à\s+les/   // should be "aux"
    ];
    
    return shouldContract.some(pattern => pattern.test(text));
  }

  /**
   * Basic verb conjugation issue detection
   * @private
   */
  private hasVerbConjugationIssues(text: string): boolean {
    // Very basic detection of common conjugation errors
    const commonErrors = [
      /je\s+est/, // should be "je suis"
      /tu\s+es\s+aller/, // should be "tu vas"
      /nous\s+est/ // should be "nous sommes"
    ];
    
    return commonErrors.some(pattern => pattern.test(text));
  }

  /**
   * Detects article usage issues
   * @private
   */
  private hasArticleIssues(text: string): boolean {
    // Check for missing or incorrect articles
    const words = text.split(/\s+/);
    let hasIssues = false;
    
    // Look for nouns without articles (very simplified)
    const commonNouns = ['maison', 'école', 'livre', 'chat', 'chien', 'voiture'];
    words.forEach((word, index) => {
      if (commonNouns.includes(word)) {
        const prevWord = words[index - 1];
        const hasArticle = prevWord && /^(le|la|un|une|du|de\s+la|au|à\s+la)$/.test(prevWord);
        if (!hasArticle && index > 0) {
          hasIssues = true;
        }
      }
    });
    
    return hasIssues;
  }
}

/**
 * Singleton instance for global use
 */
export const frenchUtils = new FrenchLanguageUtils();
