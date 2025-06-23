import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const adminHash = await bcrypt.hash('admin', 10);
  const userHash = await bcrypt.hash('user', 10);

  await knex('users').insert([
    {
      email: 'admin@example.com',
      password_hash: adminHash,
      first_name: 'admin',
      last_name: 'example',
      role: 'admin',
    },
    {
      email: 'user@example.com',
      password_hash: userHash,
      first_name: 'user',
      last_name: 'example',
      role: 'user',
    },
  ]);
}
