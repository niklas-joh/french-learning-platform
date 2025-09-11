import type { Knex } from 'knex';

/**
 * Migration to standardize ALL lesson content formats to AI-compatible structure
 * 
 * This migration ensures consistent content formats across all lesson types:
 * 
 * VOCABULARY LESSONS:
 * - Converts 'items' to 'vocabulary'
 * - Standardizes to: {word, definition, examples[], pronunciation?, difficulty?}
 * 
 * CONVERSATION LESSONS:
 * - Ensures dialogue array format with {speaker, line} objects
 * - Adds optional keyPhrases array
 * 
 * GRAMMAR LESSONS:
 * - Standardizes to: {rule, explanation, examples[]}
 * 
 * QUIZ/PRACTICE LESSONS:
 * - Standardizes to: {question, options?, answer, feedback: {correct, incorrect}}
 * 
 * @author Front-End Learning System Enhancement
 * @date September 11, 2025
 */
export async function up(knex: Knex): Promise<void> {
  console.log('Starting comprehensive lesson content standardization...');
  
  // Get ALL lessons for comprehensive standardization
  const allLessons = await knex('lessons')
    .select('id', 'type', 'contentData', 'title');

  let processedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const lesson of allLessons) {
    processedCount++;
    let contentData;
    
    try {
      contentData = JSON.parse(lesson.contentData);
    } catch (error) {
      console.log(`Skipping lesson ${lesson.id} (${lesson.type}) - invalid JSON: ${error}`);
      errorCount++;
      continue;
    }

    let updated = false;
    let normalizedContent = {};

    // Process each lesson type with appropriate standardization
    switch (lesson.type) {
      case 'vocabulary':
        const vocabResult = normalizeVocabularyContent(contentData);
        if (vocabResult.updated) {
          normalizedContent = vocabResult.content;
          updated = true;
        }
        break;

      case 'conversation':
        const convResult = normalizeConversationContent(contentData);
        if (convResult.updated) {
          normalizedContent = convResult.content;
          updated = true;
        }
        break;

      case 'grammar':
        const grammarResult = normalizeGrammarContent(contentData);
        if (grammarResult.updated) {
          normalizedContent = grammarResult.content;
          updated = true;
        }
        break;

      case 'quiz':
      case 'practice':
        const interactiveResult = normalizeInteractiveContent(contentData);
        if (interactiveResult.updated) {
          normalizedContent = interactiveResult.content;
          updated = true;
        }
        break;

      default:
        // For unknown types, ensure basic structure exists
        normalizedContent = contentData;
        console.log(`Unknown lesson type "${lesson.type}" for lesson ${lesson.id} - preserving as-is`);
    }

    // Update the lesson if changes were made
    if (updated) {
      await knex('lessons')
        .where('id', lesson.id)
        .update({
          contentData: JSON.stringify(normalizedContent),
          updatedAt: knex.fn.now()
        });
      
      updatedCount++;
      console.log(`✓ Updated ${lesson.type} lesson ${lesson.id}: ${lesson.title || 'Untitled'}`);
    }
  }

  console.log(`\nStandardization complete:`);
  console.log(`- Processed: ${processedCount} lessons`);
  console.log(`- Updated: ${updatedCount} lessons`);  
  console.log(`- Errors: ${errorCount} lessons`);
  console.log(`- Unchanged: ${processedCount - updatedCount - errorCount} lessons`);
}

/**
 * Normalizes vocabulary lesson content to standard format
 * Handles multiple legacy formats and ensures consistent structure
 */
function normalizeVocabularyContent(contentData: any): { updated: boolean; content: any } {
  let updated = false;
  let newContentData = { ...contentData };

  // Format 1: Convert {items: [{word, translation, exampleSentence}]} to standard format
  if (contentData.items && Array.isArray(contentData.items)) {
    newContentData = {
      vocabulary: contentData.items.map((item: any) => ({
        word: item.word || 'Unknown',
        definition: item.translation || item.definition || 'Definition not provided',
        examples: item.exampleSentence ? [item.exampleSentence] : (item.examples || []),
        ...(item.pronunciation && { pronunciation: item.pronunciation }),
        ...(item.difficulty && { difficulty: item.difficulty }),
      }))
    };
    updated = true;
  }
  // Format 2: Convert {vocabulary: [{french, english, audioUrl}]} to standard format  
  else if (contentData.vocabulary && Array.isArray(contentData.vocabulary)) {
    const hasLegacyFormat = contentData.vocabulary.some((item: any) => 
      item.french || item.english || item.audioUrl || item.translation || item.exampleSentence
    );
    
    if (hasLegacyFormat) {
      newContentData = {
        vocabulary: contentData.vocabulary.map((item: any) => ({
          word: item.french || item.word || 'Unknown',
          definition: item.english || item.translation || item.definition || 'Definition not provided',
          examples: item.exampleSentence ? [item.exampleSentence] : (item.examples || []),
          ...(item.pronunciation && { pronunciation: item.pronunciation }),
          ...(item.difficulty && { difficulty: item.difficulty }),
        }))
      };
      updated = true;
    }
  }
  // Format 3: Ensure existing standard format has required fields
  else if (contentData.vocabulary && Array.isArray(contentData.vocabulary)) {
    const needsFieldUpdates = contentData.vocabulary.some((item: any) => 
      !item.definition || !Array.isArray(item.examples)
    );
    
    if (needsFieldUpdates) {
      newContentData = {
        vocabulary: contentData.vocabulary.map((item: any) => ({
          word: item.word || 'Unknown',
          definition: item.definition || 'Definition not provided',
          examples: Array.isArray(item.examples) ? item.examples : [],
          ...(item.pronunciation && { pronunciation: item.pronunciation }),
          ...(item.difficulty && { difficulty: item.difficulty }),
        }))
      };
      updated = true;
    }
  }

  return { updated, content: newContentData };
}

/**
 * Normalizes conversation lesson content to standard format
 * Ensures dialogue array structure and optional key phrases
 */
function normalizeConversationContent(contentData: any): { updated: boolean; content: any } {
  let updated = false;
  let newContentData = { ...contentData };

  // Ensure dialogue is properly formatted
  if (!contentData.dialogue || !Array.isArray(contentData.dialogue)) {
    // If no dialogue, create empty structure
    newContentData.dialogue = [];
    updated = true;
  } else {
    // Validate dialogue structure  
    const needsDialogueUpdate = contentData.dialogue.some((line: any) => 
      !line.speaker || !line.line
    );
    
    if (needsDialogueUpdate) {
      newContentData.dialogue = contentData.dialogue.map((line: any, index: number) => ({
        speaker: line.speaker || `Speaker ${index + 1}`,
        line: line.line || line.text || 'No dialogue provided'
      }));
      updated = true;
    }
  }

  // Ensure keyPhrases is array if it exists
  if (contentData.keyPhrases && !Array.isArray(contentData.keyPhrases)) {
    newContentData.keyPhrases = [];
    updated = true;
  }

  // Preserve title if it exists
  if (contentData.title && !newContentData.title) {
    newContentData.title = contentData.title;
  }

  return { updated, content: newContentData };
}

/**
 * Normalizes grammar lesson content to standard format
 * Ensures rule, explanation, and examples structure
 */
function normalizeGrammarContent(contentData: any): { updated: boolean; content: any } {
  let updated = false;
  let newContentData = { ...contentData };

  // Ensure required fields exist
  if (!contentData.rule) {
    newContentData.rule = contentData.title || 'Grammar Rule';
    updated = true;
  }

  if (!contentData.explanation) {
    newContentData.explanation = contentData.content || contentData.description || 'No explanation provided';
    updated = true;
  }

  if (!contentData.examples || !Array.isArray(contentData.examples)) {
    newContentData.examples = contentData.examples ? [contentData.examples] : [];
    updated = true;
  }

  return { updated, content: newContentData };
}

/**
 * Normalizes quiz/practice content to standard interactive format
 * Ensures question, answer, and feedback structure
 */
function normalizeInteractiveContent(contentData: any): { updated: boolean; content: any } {
  let updated = false;
  let newContentData = { ...contentData };

  // Ensure question exists
  if (!contentData.question) {
    newContentData.question = 'Interactive exercise';
    updated = true;
  }

  // Ensure answer exists
  if (!contentData.answer) {
    newContentData.answer = '';
    updated = true;
  }

  // Ensure feedback structure exists
  if (!contentData.feedback || typeof contentData.feedback !== 'object') {
    newContentData.feedback = {
      correct: contentData.feedback?.correct || 'Correct!',
      incorrect: contentData.feedback?.incorrect || 'Try again!'
    };
    updated = true;
  } else {
    // Ensure both correct and incorrect feedback exist
    if (!contentData.feedback.correct || !contentData.feedback.incorrect) {
      newContentData.feedback = {
        correct: contentData.feedback.correct || 'Correct!',
        incorrect: contentData.feedback.incorrect || 'Try again!'
      };
      updated = true;
    }
  }

  // Normalize options array if it exists
  if (contentData.options && !Array.isArray(contentData.options)) {
    newContentData.options = [];
    updated = true;
  }

  return { updated, content: newContentData };
}

export async function down(knex: Knex): Promise<void> {
  console.log('Rollback not implemented - this migration standardizes data formats');
  console.log('Manual rollback would require restoring from backup if needed');
}
