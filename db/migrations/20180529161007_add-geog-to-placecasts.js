
exports.up = function(knex, Promise) {
  return knex.schema.table('placecasts', function(table) {
    table.specificType('geog', 'geography(Point,4326)')
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('placecasts', function(table) {
    table.dropColumn('geog');
  });
};
