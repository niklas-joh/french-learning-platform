/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_content_assignments', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.integer('content_id').unsigned().notNullable();
    table.foreign('content_id').references('content.id').onDelete('CASCADE');
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.string('status').notNullable().defaultTo('pending');
    table.timestamp('due_date').nullable(); // Added nullable due_date
    table.unique(['user_id', 'content_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_content_assignments'); // dropTableIfExists is safer
};
