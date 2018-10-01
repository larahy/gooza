exports.up = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.dropColumn('created_at');
    })
};
