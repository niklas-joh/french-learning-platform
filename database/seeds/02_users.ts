import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const adminHash = await bcrypt.hash('admin', 10);
  const userHash = await bcrypt.hash('user', 10);

  await knex('users').insert([
    {
      email: 'admin@example.com',
      passwordHash: adminHash,
      firstName: 'admin',
      lastName: 'example',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'user@example.com',
      passwordHash: userHash,
      firstName: 'user',
      lastName: 'example',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
