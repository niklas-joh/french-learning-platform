import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries in learning_units and lessons to prevent duplicates during re-seed.
  // Consider if this is the desired behavior for your development workflow.
  // For production, you'd likely have a different strategy.
  await knex('lessons').del();
  await knex('learning_units').del();

  // Seed Learning Units
  // Assumes 'French for Beginners' learning_paths.id = 1
  const learningPathId = 1; // TODO: Make this dynamic if possible, e.g., by selecting ID by name

  const unitIds = await knex('learning_units').insert([
    {
      learning_path_id: learningPathId,
      title: 'Unit 1: Greetings & Basics',
      description: 'Learn essential French greetings and basic introductions.',
      level: 'A1',
      order_index: 1,
      is_active: true,
    },
    {
      learning_path_id: learningPathId,
      title: 'Unit 2: Everyday Objects & Numbers',
      description: 'Identify common objects and learn to count in French.',
      level: 'A1',
      order_index: 2,
      is_active: true,
    },
    {
      learning_path_id: learningPathId,
      title: 'Unit 3: Simple Questions & Family',
      description: 'Ask and answer simple questions, and talk about your family.',
      level: 'A1',
      order_index: 3,
      is_active: true,
    },
  ]).returning('id');

  const unit1Id = unitIds[0].id;
  const unit2Id = unitIds[1].id;
  const unit3Id = unitIds[2].id;


  // Seed Lessons for Unit 1
  await knex('lessons').insert([
    {
      learning_unit_id: unit1Id,
      title: 'Lesson 1.1: Bonjour et Salut!',
      description: 'Learn to say hello in different contexts.',
      type: 'vocabulary',
      estimated_time: 10, // minutes
      order_index: 1,
      content_data: JSON.stringify({
        introduction: "Welcome to your first French lesson! Let's learn how to greet people.",
        vocabulary: [
          { french: 'Bonjour', english: 'Hello (formal)', audio_url: 'path/to/bonjour.mp3' },
          { french: 'Salut', english: 'Hi (informal)', audio_url: 'path/to/salut.mp3' },
        ],
        examples: [
          "Bonjour Madame Dubois.",
          "Salut Paul!"
        ],
        practice_prompts: ["How do you greet your teacher?", "How do you greet a friend?"]
      }),
      is_active: true,
    },
    {
      learning_unit_id: unit1Id,
      title: 'Lesson 1.2: Comment ça va?',
      description: 'Asking and answering "How are you?".',
      type: 'conversation',
      estimated_time: 15, // minutes
      order_index: 2,
      content_data: JSON.stringify({
        dialogue: [
          { speaker: "A", line: "Bonjour! Comment ça va?" },
          { speaker: "B", line: "Ça va bien, merci. Et vous?" }
        ],
        key_phrases: ["Comment ça va?", "Ça va bien.", "Merci", "Et vous/toi?"]
      }),
      is_active: true,
    },
    {
      learning_unit_id: unit1Id,
      title: 'Lesson 1.3: Au Revoir',
      description: 'Learn how to say goodbye.',
      type: 'vocabulary',
      estimated_time: 5, // minutes
      order_index: 3,
      content_data: JSON.stringify({
        vocabulary: [
          { french: 'Au revoir', english: 'Goodbye', audio_url: 'path/to/au_revoir.mp3' },
          { french: 'À bientôt', english: 'See you soon', audio_url: 'path/to/a_bientot.mp3' },
          { french: 'À demain', english: 'See you tomorrow', audio_url: 'path/to/a_demain.mp3' },
        ]
      }),
      is_active: true,
    },
  ]);

  // Seed Lessons for Unit 2
  await knex('lessons').insert([
    {
      learning_unit_id: unit2Id,
      title: 'Lesson 2.1: Les Objets de la Classe',
      description: 'Learn vocabulary for classroom objects.',
      type: 'vocabulary',
      estimated_time: 15, // minutes
      order_index: 1,
      content_data: JSON.stringify({
        vocabulary: [
          { french: 'un livre', english: 'a book' },
          { french: 'un stylo', english: 'a pen' },
          { french: 'une table', english: 'a table' },
          { french: 'une chaise', english: 'a chair' },
        ]
      }),
      is_active: true,
    },
    {
      learning_unit_id: unit2Id,
      title: 'Lesson 2.2: Counting 1-10',
      description: 'Learn to count from one to ten in French.',
      type: 'vocabulary',
      estimated_time: 10, // minutes
      order_index: 2,
      content_data: JSON.stringify({
        numbers: [
          { french: 'un', value: 1 }, { french: 'deux', value: 2 }, { french: 'trois', value: 3 },
          { french: 'quatre', value: 4 }, { french: 'cinq', value: 5 }, { french: 'six', value: 6 },
          { french: 'sept', value: 7 }, { french: 'huit', value: 8 }, { french: 'neuf', value: 9 },
          { french: 'dix', value: 10 }
        ]
      }),
      is_active: true,
    },
  ]);
  
  // Seed Lessons for Unit 3 (Basic structure, can be expanded)
    await knex('lessons').insert([
    {
      learning_unit_id: unit3Id,
      title: 'Lesson 3.1: Asking Your Name',
      description: 'Learn how to ask someone their name and state yours.',
      type: 'conversation',
      estimated_time: 15, // minutes
      order_index: 1,
      content_data: JSON.stringify({
        dialogue: [
          { speaker: "A", line: "Comment t''appelles-tu?" },
          { speaker: "B", line: "Je m''appelle Sophie. Et toi?" }
        ],
        key_phrases: ["Comment t'appelles-tu?", "Je m'appelle..."]
      }),
      is_active: true,
    },
  ]);

  console.log('Seeded learning units and lessons');
}
