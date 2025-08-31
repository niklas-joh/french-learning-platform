// server/src/services/ai/PromptTemplateEngine.ts

import { FrenchLevel } from '../../types/Assessment.js';

/**
 * Parameters for weakness analysis prompt generation
 * @interface WeaknessAnalysisParams
 */
interface WeaknessAnalysisParams {
  mistakePatterns: Record<string, number>;
  timeframe: number;
  userLevel: FrenchLevel;
  totalAssessments: number;
  correctAnswers: number;
}

/**
 * @class PromptTemplateEngine
 * @description Service that manages and renders complex prompt templates for AI interactions.
 * Enhanced with weakness analysis capabilities for Task 3.1.C.7.
 */
export class PromptTemplateEngine {
    constructor() {}

    /**
     * Generate content prompt for AI generation with structured JSON requirements
     * 
     * **PHASE 2 ENHANCEMENT**: Added JSON structure requirements to fix content
     * validation issues. Ensures AI responses match expected interface structures.
     * 
     * @param params - Content generation parameters
     * @returns Promise resolving to enhanced prompt with JSON structure requirements
     */
    public async generateContentPrompt(params: {
        request: any;
        template: any;
        context: any;
    }): Promise<string> {
        const { request, context } = params;
        
        // REUSE existing prompt logic with JSON structure enhancement
        const basePrompt = this.getBasePromptForType(request.type, request, context);
        
        // Add JSON structure requirements to existing prompts
        const jsonStructure = this.getJSONStructureForType(request.type);
        
        return `${basePrompt}

**CRITICAL: Respond with VALID JSON ONLY matching these exact field names:**
${jsonStructure}

**IMPORTANT REQUIREMENTS:**
- description field must be at least 20 characters long
- sections array must contain at least 1 item
- Follow exact field naming as specified above
- Ensure all required fields are included`;
    }

    /**
     * Generate base prompt for specific content type
     * 
     * **REUSES**: Existing prompt approach while adding content-type specificity
     * 
     * @param type - Content type (lesson, vocabulary_drill, etc.)
     * @param request - Content request with parameters
     * @param context - User context for personalization
     * @returns Base prompt string for the content type
     */
    private getBasePromptForType(type: string, request: any, context: any): string {
        const level = context.currentLevel || 'A2';
        const topics = request.topics?.join(', ') || 'general French concepts';
        const difficulty = request.difficulty || 'medium';

        switch (type) {
            case 'lesson':
                return `Create a comprehensive French lesson for ${level} level:

**LESSON SPECIFICATIONS:**
- Topic: ${topics}
- User Level: ${level}
- Difficulty: ${difficulty}
- Duration: ${request.duration || 15} minutes

**LESSON REQUIREMENTS:**
1. Clear learning objectives appropriate for ${level}
2. Structured progression: introduction → explanation → examples → practice
3. Include vocabulary with pronunciations and examples
4. Provide practical exercises that reinforce concepts
5. Cultural context where relevant

**PEDAGOGICAL APPROACH:**
- Focus on communication over grammar rules
- Include real-world application examples
- Balance challenge with achievability for ${level} level
- Encourage active practice and engagement`;

            case 'vocabulary_drill':
                return `Create French vocabulary practice for ${level} level:
                
**Topic**: ${topics}
**Difficulty**: ${difficulty}
**Focus**: Essential vocabulary with practical usage examples`;

            case 'grammar_exercise':
                return `Create French grammar exercises for ${level} level:
                
**Topic**: ${topics} 
**Difficulty**: ${difficulty}
**Focus**: Clear explanations with practice opportunities`;

            default:
                return `Generate ${type} content for ${level} level French learners. Topic: ${topics}. Difficulty: ${difficulty}.`;
        }
    }

    /**
     * Get JSON structure requirements for specific content type
     * 
     * **ENSURES**: AI responses match expected TypeScript interfaces exactly
     * 
     * @param type - Content type needing structure specification
     * @returns JSON structure template as string
     */
    private getJSONStructureForType(type: string): string {
        switch (type) {
            case 'lesson':
                return `{
  "type": "lesson",
  "title": "string - engaging lesson title",
  "description": "string - comprehensive lesson overview (minimum 20 characters)",
  "sections": [
    {
      "type": "introduction|presentation|practice|wrap_up",
      "title": "string - section title", 
      "content": "string - section content",
      "duration": "number - minutes for this section",
      "exercises": ["array - optional exercises for this section"]
    }
  ],
  "vocabulary": [
    {
      "word": "string - French word",
      "definition": "string - English definition", 
      "pronunciation": "string - phonetic guide",
      "examples": ["array - example sentences in French"],
      "difficulty": "easy|medium|hard"
    }
  ],
  "learningObjectives": [
    "string - specific learning outcome 1",
    "string - specific learning outcome 2"
  ],
  "estimatedTime": "number - total lesson time in minutes"
}`;

            case 'vocabulary_drill':
                return `{
  "type": "vocabulary_drill",
  "title": "string",
  "description": "string - minimum 20 characters",
  "vocabulary": [
    {
      "word": "string - French word",
      "definition": "string - English definition",
      "pronunciation": "string - phonetic guide",
      "examples": ["array - example sentences"],
      "difficulty": "easy|medium|hard"
    }
  ],
  "exercises": [
    {
      "type": "exercise type",
      "instruction": "string",
      "items": ["array - exercise items"]
    }
  ]
}`;

            default:
                return `{
  "type": "${type}",
  "title": "string",
  "description": "string - minimum 20 characters",
  "content": "object - structured content for ${type}"
}`;
        }
    }

    /**
     * Generates a comprehensive weakness analysis prompt for French language learning.
     * Tailored to the user's CEFR level and assessment patterns.
     * @param {WeaknessAnalysisParams} params - Analysis parameters including patterns and user context.
     * @returns {string} A structured prompt for AI analysis.
     */
    public generateWeaknessAnalysisPrompt(params: WeaknessAnalysisParams): string {
        const { mistakePatterns, timeframe, userLevel, totalAssessments, correctAnswers } = params;
        const accuracy = totalAssessments > 0 ? (correctAnswers / totalAssessments * 100).toFixed(1) : '0';

        return `Analyze French learning patterns for a ${userLevel} level student:

**Assessment Data (${timeframe} days):**
- Total assessments: ${totalAssessments}
- Correct answers: ${correctAnswers}
- Overall accuracy: ${accuracy}%
- Error patterns: ${JSON.stringify(mistakePatterns, null, 2)}

**Analysis Requirements:**
As a French pedagogy expert, provide:
1. **Primary Weaknesses**: 3-5 specific areas where the student struggles most
2. **Improvement Areas**: Specific skills that need focused practice
3. **Strength Areas**: What the student does well (for encouragement)
4. **Recommendations**: Concrete, actionable study suggestions tailored to ${userLevel} level

**Response Format:**
Return ONLY valid JSON:
{
  "primaryWeaknesses": ["weakness1", "weakness2", "weakness3"],
  "improvementAreas": ["area1", "area2", "area3"],
  "strengthAreas": ["strength1", "strength2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

**Guidelines:**
- Focus on French-specific challenges (gender agreement, verb conjugation, pronunciation)
- Consider CEFR ${userLevel} level expectations and progression
- Provide encouraging but honest assessment
- Include cultural context where relevant
- Suggest specific practice methods and resources`;
    }

    // Future methods:
    // public render(templateName: string, context: object): string {}
}
