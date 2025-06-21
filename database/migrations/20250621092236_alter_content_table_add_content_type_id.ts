import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Add the new content_type_id column, allowing null values initially
  await knex.schema.alterTable('content', (table) => {
    table.integer('content_type_id').unsigned();
  });

  // 2. Create a mapping from old type names to new content_type IDs
  const typeMapping: { [key: string]: number } = {
    'multiple-choice': 1,
    'true-false': 2, // Assuming this might exist or be added
    'fill-in-the-blank': 3,
  };

  // 3. Update the new column based on the old 'type' column
  const contents = await knex('content').select('id', 'type');
  for (const content of contents) {
    const typeId = typeMapping[content.type];
    if (typeId) {
      await knex('content').where('id', content.id).update({ content_type_id: typeId });
    }
  }

  // 4. Add the foreign key constraint
  await knex.schema.alterTable('content', (table) => {
    table.foreign('content_type_id').references('content_types.id').onDelete('SET NULL');
  });

  // 5. Make the column not nullable
  await knex.schema.alterTable('content', (table) => {
    table.integer('content_type_id').notNullable().alter();
  });

  // 6. Drop the old 'type' column
  await knex.schema.alterTable('content', (table) => {
    table.dropColumn('type');
  });
}

export async function down(knex: Knex): Promise<void> {
  // 1. Add the old 'type' column back
  await knex.schema.alterTable('content', (table) => {
    table.string('type');
  });

  // 2. Create a reverse mapping from content_type IDs to old type names
  const reverseTypeMapping: { [key: number]: string } = {
    1: 'multiple-choice',
    2: 'true-false',
    3: 'fill-in-the-blank',
  };

  // 3. Update the 'type' column based on the 'content_type_id'
  const contents = await knex('content').select('id', 'content_type_id');
  for (const content of contents) {
    const typeName = reverseTypeMapping[content.content_type_id];
    if (typeName) {
      await knex('content').where('id', content.id).update({ type: typeName });
    }
  }

  // 4. Drop the foreign key and the 'content_type_id' column
  await knex.schema.alterTable('content', (table) => {
    table.dropForeign('content_type_id');
    table.dropColumn('content_type_id');
  });
}
