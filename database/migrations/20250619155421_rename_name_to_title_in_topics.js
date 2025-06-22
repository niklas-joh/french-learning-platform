exports.up = function(knex) {
  return knex.schema.table('topics', function(table) {
    table.renameColumn('name', 'title');
  });
};

exports.down = function(knex) {
  return knex.schema.table('topics', function(table) {
    table.renameColumn('title', 'name');
  });
};
