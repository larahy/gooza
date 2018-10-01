exports.up = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.boolean('published').defaultTo(true)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.dropColumn('published');
    })
};
