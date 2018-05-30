
exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS postgis');
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP EXTENSION IF EXISTS postgis');
};

