exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.text('first_name').notNullable();
    table.text('last_name');
    table.text('email').notNullable().unique();
    table.text('password')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};