import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('user_content_assignments').del();

  const admin = await knex('users').where({ email: 'admin@example.com' }).first();
  const user = await knex('users').where({ email: 'user@example.com' }).first();

  const greet = await knex('content').where({ name: 'greeting_evening' }).first();
  const food = await knex('content').where({ name: 'food_phrase_blank' }).first();
  const travel = await knex('content').where({ name: 'travel_sentence_fix' }).first();

  if (!admin || !user || !greet || !food || !travel) {
    throw new Error('Missing prerequisite data for assignments seed');
  }

  await knex('user_content_assignments').insert([
    { user_id: admin.id, content_id: greet.id, status: 'pending' },
    { user_id: user.id, content_id: food.id, status: 'pending' },
    { user_id: user.id, content_id: travel.id, status: 'pending' },
  ]);
}
