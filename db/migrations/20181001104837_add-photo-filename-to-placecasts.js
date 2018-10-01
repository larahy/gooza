exports.up = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.text('s3_photo_filename').unique();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('placecasts', function(table){
        table.dropColumn('s3_photo_filename');
    })
};
