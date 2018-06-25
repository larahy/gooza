exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('placecasts', function(table){
      table.integer('user_id').notNull().defaultTo(0);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('placecasts', function(table){
      table.dropColumn('user_id');
    })
  ])
};