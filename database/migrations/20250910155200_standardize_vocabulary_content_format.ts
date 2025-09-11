import type { Knex } from 'knex';

/**
 * Migration to standardize vocabulary lesson content format
 * Converts all vocabulary content to AI-compatible format:
 * - Changes 'items' to 'vocabulary' 
 * - Changes 'translation' to 'definition'
 * - Changes single 'exampleSentence' to 'examples' array
 * - Standardizes mixed legacy formats
 */
export async function up(knex: Knex): Promise<void> {
  // Get all vocabulary lessons
  const vocabularyLessons = await knex('lessons')
    .where('type', 'vocabulary')
    .select('id', 'contentData');

  for (const lesson of vocabularyLessons) {
    let contentData;
    try {
      contentData = JSON.parse(lesson.contentData);
    } catch (error) {
      console.log(`Skipping lesson ${lesson.id} - invalid JSON`);
      continue;
    }

    let updated = false;
    let newContentData = { ...contentData };

    // Format 1: Convert {items: [{word, translation, exampleSentence}]} 
    // to {vocabulary: [{word, definition, examples}]}
    if (contentData.items && Array.isArray(contentData.items)) {
      newContentData = {
        vocabulary: contentData.items.map((item: any) => ({
          word: item.word,
          definition: item.translation || item.definition,
          examples: item.exampleSentence ? [item.exampleSentence] : (item.examples || []),
          ...(item.pronunciation && { pronunciation: item.pronunciation }),
          ...(item.difficulty && { difficulty: item.difficulty }),
        }))
      };
      updated = true;
    }
    // Format 2: Convert {vocabulary: [{french, english, audioUrl}]} 
    // to {vocabulary: [{word, definition, examples}]}
    else if (contentData.vocabulary && Array.isArray(contentData.vocabulary)) {
      const hasOldFormat = contentData.vocabulary.some((item: any) => 
        item.french || item.english || item.audioUrl
      );
      
      if (hasOldFormat) {
        newContentData = {
          vocabulary: contentData.vocabulary.map((item: any) => ({
            word: item.french || item.word,
            definition: item.english || item.definition,
            examples: item.examples || [],
            ...(item.pronunciation && { pronunciation: item.pronunciation }),
            ...(item.difficulty && { difficulty: item.difficulty }),
          }))
        };
        updated = true;
      }
    }

    // Update the lesson if changes were made
    if (updated) {
      await knex('lessons')
        .where('id', lesson.id)
        .update({
          contentData: JSON.stringify(newContentData),
          updatedAt: knex.fn.now()
        });
      
      console.log(`Updated lesson ${lesson.id}: ${lesson.title || 'Untitled'}`);
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log('Rollback not implemented - this migration standardizes data formats');
  console.log('Manual rollback would require restoring from backup if needed');
}
