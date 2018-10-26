exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table){
    table.boolean('active').defaultTo(false)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table){
    table.dropColumn('active');
  })
};

