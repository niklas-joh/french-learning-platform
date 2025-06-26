import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Check and delete from user_achievements if it exists
  const hasUserAchievements = await knex.schema.hasTable('user_achievements');
  if (hasUserAchievements) {
    await knex('user_achievements').del();
  } else {
    console.warn("Table 'user_achievements' does not exist. Skipping deletion.");
  }

  // Check and delete from achievements if it exists
  const hasAchievements = await knex.schema.hasTable('achievements');
  if (hasAchievements) {
    await knex('achievements').del();
  } else {
    console.warn("Table 'achievements' does not exist. Skipping deletion.");
  }

  // Check and delete from learning_paths if it exists
  const hasLearningPaths = await knex.schema.hasTable('learning_paths');
  if (hasLearningPaths) {
    await knex('learning_paths').del();
  } else {
    console.warn("Table 'learning_paths' does not exist. Skipping deletion.");
  }

  // Seed Learning Paths - only if table exists (it should have been created by migrations)
  if (hasLearningPaths) {
    await knex('learning_paths').insert([
      {
        id: 1, // Explicitly set ID for predictability in other seeds
        language: 'french',
        name: 'French for Beginners',
        description: 'Complete French course from A1 to B2 level. (This is a placeholder, actual content will determine levels covered)',
        total_lessons: 0, // This should be updated dynamically later or by a script
        estimated_duration: 0, // This should be updated dynamically later
        is_active: true,
      },
    ]);
  } else {
    console.error("Cannot seed 'learning_paths' as table does not exist. Migration may have failed.");
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
        criteria_data: JSON.stringify({ type: 'lessons_completed', value: 1 }),
        rarity: 'common',
        is_active: true,
      },
      {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteria_data: JSON.stringify({ type: 'streak', value: 7 }),
        rarity: 'rare',
        is_active: true,
      },
      {
        id: 'perfect_quiz',
        name: 'Perfectionist',
        description: 'Score 100% on any quiz',
        icon: '⭐',
        category: 'accuracy',
        criteria_data: JSON.stringify({ type: 'accuracy_threshold', value: 100 }),
        rarity: 'epic',
        is_active: true,
      },
      {
        id: 'vocab_master_10',
        name: 'Word Collector',
        description: 'Learn 10 new vocabulary words.',
        icon: '📚',
        category: 'vocabulary',
        criteria_data: JSON.stringify({ type: 'words_learned', value: 10 }),
        rarity: 'common',
        is_active: true,
      }
    ]);
  } else {
    console.error("Cannot seed 'achievements' as table does not exist. Migration may have failed.");
  }

  console.log('Attempted to seed core data (learning_paths, achievements)');
}
