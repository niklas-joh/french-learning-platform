import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('content').del();

  const greetings = await knex('topics').where({ name: 'Greetings' }).first();
  const food = await knex('topics').where({ name: 'Food and Dining' }).first();
  const travel = await knex('topics').where({ name: 'Travel' }).first();

  if (!greetings || !food || !travel) {
    throw new Error('Required topics missing for content seed');
  }

  await knex('content').insert([
    {
      name: 'greeting_evening',
      topic_id: greetings.id,
      content_type_id: 1,
      question_data: JSON.stringify({
        text: "Which phrase means 'Good evening' in French?",
        explanation: 'Basic greeting vocabulary',
        feedback: {
          correct: "Correct! 'Bonsoir' is used in the evening.",
          incorrect: "Remember that 'Bonsoir' is specifically used in the evening."
        }
      }),
      correct_answer: JSON.stringify(1),
      options: JSON.stringify(['Bonjour', 'Bonsoir', 'Bonne nuit']),
      difficulty_level: 'A1'
    },
    {
      name: 'food_phrase_blank',
      topic_id: food.id,
      content_type_id: 2,
      question_data: JSON.stringify({
        text: 'Je voudrais manger un _____ au fromage.',
        explanation: 'Use the correct food item',
        feedback: {
          correct: 'Great!',
          incorrect: "The correct word is 'sandwich'."
        }
      }),
      correct_answer: JSON.stringify('sandwich'),
      options: null,
      difficulty_level: 'A1'
    },
    {
      name: 'travel_sentence_fix',
      topic_id: travel.id,
      content_type_id: 3,
      question_data: JSON.stringify({
        text: "Corrigez la phrase: 'Je aller au musée demain.'",
        explanation: "Conjugation of 'aller' in the near future",
        feedback: {
          correct: 'Parfait!',
          incorrect: "It should be 'Je vais aller au musée demain.'"
        }
      }),
      correct_answer: JSON.stringify('Je vais aller au musée demain.'),
      options: null,
      difficulty_level: 'A2'
    }
  ]);
}
