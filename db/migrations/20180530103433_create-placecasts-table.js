exports.up = function(knex, Promise) {
  return knex.schema.createTable('placecasts', function(table){
    table.increments();
    table.string('title').notNullable().unique();
    table.text('subtitle');
    table.text('s3_audio_filename').unique();
    table.specificType('geom', 'geometry(Point,4326)')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('placecasts');
};
