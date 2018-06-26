exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('placecasts', function(table){
      table.integer('user_id').index().references('id').inTable('users')
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