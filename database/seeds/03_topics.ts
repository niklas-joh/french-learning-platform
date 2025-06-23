import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('topics').del();

  await knex('topics').insert([
    {
      name: 'Greetings',
      description: 'Common French greetings and introductions',
    },
    {
      name: 'Food and Dining',
      description: 'Vocabulary related to eating out and cooking',
    },
    {
      name: 'Travel',
      description: 'Phrases for traveling around France',
    },
  ]);
}
