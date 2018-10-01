exports.up = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.float('pitch').defaultTo(0)
        table.float('heading').defaultTo(90)
        table.integer('zoom').defaultTo(0)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.dropColumn('pitch');
        table.dropColumn('heading');
        table.dropColumn('zoom');
    })
};
