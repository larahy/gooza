exports.up = function(knex, Promise) {
  return knex.schema.createTable('placecasts', function(table){
    table.increments();
    table.string('title').notNullable().unique();
    table.text('subtitle');
    table.decimal('lat', [9], [7]).notNull().defaultTo(0.0000000);
    table.decimal('long', [10], [7]).notNull().defaultTo(0.0000000);
    table.text('address');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('placecasts');
};
