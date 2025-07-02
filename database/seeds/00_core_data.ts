import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Check and delete from userAchievements if it exists
  const hasUserAchievements = await knex.schema.hasTable('userAchievements');
  if (hasUserAchievements) {
    await knex('userAchievements').del();
  } else {
    console.warn("Table 'userAchievements' does not exist. Skipping deletion.");
  }

  // Check and delete from achievements if it exists
  const hasAchievements = await knex.schema.hasTable('achievements');
  if (hasAchievements) {
    await knex('achievements').del();
  } else {
    console.warn("Table 'achievements' does not exist. Skipping deletion.");
  }

  // Check and delete from learningPaths if it exists
  const hasLearningPaths = await knex.schema.hasTable('learningPaths');
  if (hasLearningPaths) {
    await knex('learningPaths').del();
  } else {
    console.warn("Table 'learningPaths' does not exist. Skipping deletion.");
  }

  // Seed Learning Paths - only if table exists (it should have been created by migrations)
  if (hasLearningPaths) {
    await knex('learningPaths').insert([
      {
        id: 1, // Explicitly set ID for predictability in other seeds
        language: 'french',
        name: 'French for Beginners',
        description: 'Complete French course from A1 to B2 level. (This is a placeholder, actual content will determine levels covered)',
        totalLessons: 0, // This should be updated dynamically later or by a script
        estimatedDuration: 0, // This should be updated dynamically later
        isActive: true,
      },
    ]);
  } else {
    console.error("Cannot seed 'learningPaths' as table does not exist. Migration may have failed.");
  }

  // Seed Achievements - only if table exists
  if (hasAchievements) {
    await knex('achievements').insert([
      {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'lessons',
        criteriaData: JSON.stringify({ type: 'lessonsCompleted', value: 1 }),
        rarity: 'common',
        isActive: true,
      },
      {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteriaData: JSON.stringify({ type: 'streak', value: 7 }),
        rarity: 'rare',
        isActive: true,
      },
      {
        id: 'perfect_quiz',
        name: 'Perfectionist',
        description: 'Score 100% on any quiz',
        icon: '⭐',
        category: 'accuracy',
        criteriaData: JSON.stringify({ type: 'accuracyThreshold', value: 100 }),
        rarity: 'epic',
        isActive: true,
      },
      {
        id: 'vocab_master_10',
        name: 'Word Collector',
        description: 'Learn 10 new vocabulary words.',
        icon: '📚',
        category: 'vocabulary',
        criteriaData: JSON.stringify({ type: 'wordsLearned', value: 10 }),
        rarity: 'common',
        isActive: true,
      }
    ]);
  } else {
    console.error("Cannot seed 'achievements' as table does not exist. Migration may have failed.");
  }

  console.log('Attempted to seed core data (learningPaths, achievements)');
}
