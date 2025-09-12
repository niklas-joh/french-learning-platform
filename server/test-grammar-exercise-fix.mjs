#!/usr/bin/env node

/**
 * Integration test for grammar exercise structurer fix
 * 
 * This test validates that the grammar exercise structurer is properly
 * registered and can transform AI content into structured exercises.
 */

import { ContentStructurerFactory } from './dist/services/contentGeneration/ContentStructurerFactory.js';

console.log('🧪 Testing Grammar Exercise Structurer Fix...\n');

async function testGrammarExerciseStructurer() {
  try {
    // Step 1: Verify factory can create grammar exercise structurer
    console.log('1️⃣ Testing ContentStructurerFactory registration...');
    const factory = new ContentStructurerFactory();
    const structurer = factory.getStructurer('grammar_exercise');
    console.log('✅ Grammar exercise structurer successfully retrieved from factory\n');

    // Step 2: Test with mock AI-generated content (full IStructuredGrammarExercise format)
    console.log('2️⃣ Testing structurer with AI-generated content...');
    const mockAIContent = {
      type: "grammar_exercise",
      title: "French Grammar Practice",
      description: "Practice French grammar with fill-in-the-blank exercises.",
      learningObjectives: [
        "Master French verb conjugations",
        "Apply grammar rules in context"
      ],
      estimatedTime: 10,
      grammarRule: "Present and past tense conjugations",
      explanation: "Complete the sentences with the correct verb forms. Pay attention to context clues.",
      examples: [
        "Je parle français. (I speak French)",
        "Nous sommes allés au cinéma. (We went to the cinema)"
      ],
      exercises: [
        {
          type: "fill_in_blank",
          instruction: "Complete the sentences with the correct verb forms",
          items: [
            {
              type: "fill_in_blank",
              sentence: "Je ___ français tous les jours.",
              correctAnswers: ["parle"],
              blanks: [{ position: 3, length: 5 }],
              hints: ["present tense of parler"]
            },
            {
              type: "fill_in_blank", 
              sentence: "Nous ___ au cinéma hier soir.",
              correctAnswers: ["sommes allés", "sommes allées"],
              blanks: [{ position: 5, length: 12 }],
              hints: ["past tense with être"]
            }
          ],
          feedback: "Review the grammar rule if you made mistakes.",
          difficulty: "medium",
          estimatedTime: 5
        }
      ],
      tips: [
        "Read each sentence carefully for context",
        "Consider the grammatical structure",
        "Think about verb conjugations and agreements"
      ],
      commonMistakes: [
        "Watch for verb conjugation patterns",
        "Check gender and number agreements",
        "Consider sentence context and meaning"
      ]
    };

    const structuredContent = await structurer.structure(mockAIContent);
    console.log('✅ AI content successfully structured\n');

    // Step 3: Validate structured content format
    console.log('3️⃣ Validating structured content format...');
    
    // Check required fields
    const requiredFields = [
      'type', 'title', 'description', 'learningObjectives', 
      'estimatedTime', 'grammarRule', 'explanation', 'exercises', 'tips', 'commonMistakes'
    ];
    
    for (const field of requiredFields) {
      if (!structuredContent.hasOwnProperty(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    console.log('✅ All required fields present');

    // Check type is correct
    if (structuredContent.type !== 'grammar_exercise') {
      throw new Error(`Expected type 'grammar_exercise', got '${structuredContent.type}'`);
    }
    console.log('✅ Content type is correct');

    // Check exercises array
    if (!Array.isArray(structuredContent.exercises) || structuredContent.exercises.length === 0) {
      throw new Error('Exercises array is missing or empty');
    }
    console.log('✅ Exercises array is present and populated');

    // Check exercise structure
    const exercise = structuredContent.exercises[0];
    if (exercise.type !== 'fill_in_blank') {
      throw new Error(`Expected exercise type 'fill_in_blank', got '${exercise.type}'`);
    }
    console.log('✅ Exercise type is correct');

    // Check exercise items
    if (!Array.isArray(exercise.items) || exercise.items.length !== 2) {
      throw new Error(`Expected 2 exercise items, got ${exercise.items?.length || 0}`);
    }
    console.log('✅ Exercise items are correctly structured');

    // Check first exercise item
    const item = exercise.items[0];
    if (item.sentence !== "Je ___ français tous les jours." || 
        !item.correctAnswers.includes("parle") ||
        item.blanks.length !== 1) {
      throw new Error('Exercise item content is not correctly transformed');
    }
    console.log('✅ Exercise item transformation is correct\n');

    // Step 4: Test with string input (legacy format)
    console.log('4️⃣ Testing with string input (legacy format)...');
    const jsonContent = JSON.stringify(mockAIContent);
    const structuredFromString = await structurer.structure(jsonContent);
    
    if (structuredFromString.type !== 'grammar_exercise') {
      throw new Error('String input parsing failed');
    }
    console.log('✅ String input parsing works correctly\n');

    // Success summary
    console.log('🎉 ALL TESTS PASSED! 🎉\n');
    console.log('📊 Test Results Summary:');
    console.log('✅ ContentStructurerFactory registration: SUCCESS');
    console.log('✅ AI content transformation: SUCCESS');
    console.log('✅ Required field validation: SUCCESS');
    console.log('✅ Exercise structure validation: SUCCESS');
    console.log('✅ String input compatibility: SUCCESS');
    console.log('\n🔧 The grammar exercise structurer fix is working correctly!');
    console.log('📝 The "No structurer registered for content type: grammar_exercise" error should now be resolved.');

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error('\n🔍 Debug Information:');
    console.error('Error Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testGrammarExerciseStructurer();
