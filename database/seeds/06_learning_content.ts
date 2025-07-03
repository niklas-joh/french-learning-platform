import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries in lessons and learningUnits to prevent duplicates.
  await knex('lessons').del();
  await knex('learningUnits').del();

  // Seed Learning Units
  const learningPathId = 1; // Assumes 'French for Beginners' learningPaths.id = 1

  const unitIds = await knex('learningUnits').insert([
    {
      learningPathId: learningPathId,
      title: 'Unit 1: Greetings & Basics',
      description: 'Learn essential French greetings and basic introductions.',
      level: 'A1',
      orderIndex: 1,
      isActive: true,
    },
    {
      learningPathId: learningPathId,
      title: 'Unit 2: Everyday Objects & Numbers',
      description: 'Identify common objects and learn to count in French.',
      level: 'A1',
      orderIndex: 2,
      isActive: true,
    },
    {
      learningPathId: learningPathId,
      title: 'Unit 3: Simple Questions & Family',
      description: 'Ask and answer simple questions, and talk about your family.',
      level: 'A1',
      orderIndex: 3,
      isActive: true,
    },
    {
      learningPathId: learningPathId,
      title: 'Unit 4: Practice Exercises',
      description: 'Legacy practice exercises from the old content system.',
      level: 'A1-A2',
      orderIndex: 4,
      isActive: true,
    },
  ]).returning('id');

  const [unit1Id, unit2Id, unit3Id, practiceUnitId] = unitIds.map(u => u.id);

  // Seed Lessons for Unit 1
  await knex('lessons').insert([
    {
      learningUnitId: unit1Id,
      title: 'Lesson 1.1: Bonjour et Salut!',
      description: 'Learn to say hello in different contexts.',
      type: 'vocabulary',
      estimatedTime: 10,
      orderIndex: 1,
      contentData: JSON.stringify({
        items: [
          { word: 'Bonjour', translation: 'Hello (formal)', exampleSentence: 'Bonjour Madame Dubois.' },
          { word: 'Salut', translation: 'Hi (informal)', exampleSentence: 'Salut Paul!' },
        ]
      }),
      isActive: true,
    },
    {
      learningUnitId: unit1Id,
      title: 'Lesson 1.2: Comment ça va?',
      description: 'Asking and answering "How are you?".',
      type: 'conversation',
      estimatedTime: 15,
      orderIndex: 2,
      contentData: JSON.stringify({
        title: 'Checking In',
        dialogue: [
          { speaker: "Alice", line: "Bonjour! Comment ça va?" },
          { speaker: "Ben", line: "Ça va bien, merci. Et vous?" }
        ]
      }),
      isActive: true,
    },
    {
      learningUnitId: unit1Id,
      title: 'Lesson 1.3: Au Revoir',
      description: 'Learn how to say goodbye.',
      type: 'vocabulary',
      estimatedTime: 5,
      orderIndex: 3,
      contentData: JSON.stringify({
        vocabulary: [
          { french: 'Au revoir', english: 'Goodbye', audioUrl: 'path/to/au_revoir.mp3' },
          { french: 'À bientôt', english: 'See you soon', audioUrl: 'path/to/a_bientot.mp3' },
          { french: 'À demain', english: 'See you tomorrow', audioUrl: 'path/to/a_demain.mp3' },
        ]
      }),
      isActive: true,
    },
  ]);

  // Seed Lessons for Unit 2
  await knex('lessons').insert([
    {
      learningUnitId: unit2Id,
      title: 'Lesson 2.1: Les Objets de la Classe',
      description: 'Learn vocabulary for classroom objects.',
      type: 'vocabulary',
      estimatedTime: 15,
      orderIndex: 1,
      contentData: JSON.stringify({
        vocabulary: [
          { french: 'un livre', english: 'a book' },
          { french: 'un stylo', english: 'a pen' },
          { french: 'une table', english: 'a table' },
          { french: 'une chaise', english: 'a chair' },
        ]
      }),
      isActive: true,
    },
    {
      learningUnitId: unit2Id,
      title: 'Lesson 2.2: Counting 1-10',
      description: 'Learn to count from one to ten in French.',
      type: 'vocabulary',
      estimatedTime: 10,
      orderIndex: 2,
      contentData: JSON.stringify({
        items: [
          { word: 'Un', translation: 'One', exampleSentence: 'J\'ai un stylo.' },
          { word: 'Deux', translation: 'Two', exampleSentence: 'Il a deux frères.' },
          { word: 'Trois', translation: 'Three', exampleSentence: 'Nous avons trois chats.' },
        ]
      }),
      isActive: true,
    },
    {
      learningUnitId: unit2Id,
      title: 'Lesson 2.3: Le, La, Les - Definite Articles',
      description: 'Understand how to use definite articles in French.',
      type: 'grammar',
      estimatedTime: 20,
      orderIndex: 3,
      contentData: JSON.stringify({
        rule: 'Definite Articles (Le, La, L\', Les)',
        explanation: 'Definite articles are used to refer to specific nouns. They are equivalent to "the" in English. The form changes depending on the gender and number of the noun.',
        examples: [
          'Le garçon (the boy) - masculine singular',
          'La fille (the girl) - feminine singular',
          'L\'ami (the friend) - singular, starts with a vowel',
          'Les enfants (the children) - plural',
        ]
      }),
      isActive: true,
    },
  ]);
  
  // Seed Lessons for Unit 3
  await knex('lessons').insert([
    {
      learningUnitId: unit3Id,
      title: 'Lesson 3.1: Asking Your Name',
      description: 'Learn how to ask someone their name and state yours.',
      type: 'conversation',
      estimatedTime: 15,
      orderIndex: 1,
      contentData: JSON.stringify({
        dialogue: [
          { speaker: "A", line: "Comment t''appelles-tu?" },
          { speaker: "B", line: "Je m''appelle Sophie. Et toi?" }
        ],
        keyPhrases: ["Comment t'appelles-tu?", "Je m'appelle..."]
      }),
      isActive: true,
    },
  ]);

  // ** NEW: Seed migrated legacy content as practice lessons **
  await knex('lessons').insert([
    {
      learningUnitId: practiceUnitId,
      title: 'Practice: Evening Greeting',
      description: 'Difficulty: A1',
      type: 'quiz', // from content_type_id: 1
      estimatedTime: 5,
      orderIndex: 1,
      contentData: JSON.stringify({
        question: "Which phrase means 'Good evening' in French?",
        explanation: 'Basic greeting vocabulary',
        feedback: {
          correct: "Correct! 'Bonsoir' is used in the evening.",
          incorrect: "Remember that 'Bonsoir' is specifically used in the evening."
        },
        answer: 'Bonsoir',
        options: ['Bonjour', 'Bonsoir', 'Bonne nuit'],
      }),
      isActive: true,
    },
    {
      learningUnitId: practiceUnitId,
      title: 'Practice: Food Phrase',
      description: 'Difficulty: A1',
      type: 'practice', // from content_type_id: 2
      estimatedTime: 5,
      orderIndex: 2,
      contentData: JSON.stringify({
        question: 'Je voudrais manger un _____ au fromage.',
        explanation: 'Use the correct food item',
        feedback: {
          correct: 'Great!',
          incorrect: "The correct word is 'sandwich'."
        },
        answer: 'sandwich',
      }),
      isActive: true,
    },
    {
      learningUnitId: practiceUnitId,
      title: 'Practice: Travel Sentence',
      description: 'Difficulty: A2',
      type: 'practice', // from content_type_id: 3
      estimatedTime: 5,
      orderIndex: 3,
      contentData: JSON.stringify({
        question: "Corrigez la phrase: 'Je aller au musée demain.'",
        explanation: "Conjugation of 'aller' in the near future",
        feedback: {
          correct: 'Parfait!',
          incorrect: "It should be 'Je vais aller au musée demain.'"
        },
        answer: 'Je vais aller au musée demain.',
      }),
      isActive: true,
    }
  ]);

  console.log('Seeded learning units, lessons, and migrated practice exercises.');
}
