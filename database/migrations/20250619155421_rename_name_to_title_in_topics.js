// This migration originally renamed the `name` column in the `topics` table to
// `title`.  The rest of the codebase, however, still expects the column to be
// called `name`.  Running the original migration would therefore break queries
// and tests.  To keep new installs consistent with the current code we instead
// ensure the column is named `name`.  If a previous install already renamed the
// column to `title`, running this migration will rename it back.

exports.up = async function (knex) {
  const hasTitle = await knex.schema.hasColumn('topics', 'title');
  const hasName = await knex.schema.hasColumn('topics', 'name');
  if (hasTitle && !hasName) {
    await knex.schema.table('topics', function (table) {
      table.renameColumn('title', 'name');
    });
  }
};

exports.down = async function (knex) {
  const hasName = await knex.schema.hasColumn('topics', 'name');
  const hasTitle = await knex.schema.hasColumn('topics', 'title');
  if (hasName && !hasTitle) {
    await knex.schema.table('topics', function (table) {
      table.renameColumn('name', 'title');
    });
  }
};
