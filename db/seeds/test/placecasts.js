const knexPostgis = require('knex-postgis');

exports.seed = function (knex, Promise) {
  const st = knexPostgis(knex);
  return knex('placecasts').del() // Deletes ALL existing entries
    .then(function () { // Inserts seed entries one by one in series
      return knex('placecasts').insert({
        title: "Highgate Cemetery",
        subtitle: "Once the site of dueling magicians and mobs of stake-carrying vampire hunters, now the burial ground of Karl Marx, Douglas Adams and James Holman",
        s3_audio_filename: "highgate_cemetery.mp3",
        s3_photo_filename: "highgate_cemetery.jpg",
        geom: st.geomFromText('Point(-0.1483 51.5675)', 4326)
      });
    }).then(function () {
      return knex('placecasts').insert({
        title: "The Hardy Tree",
        subtitle: "An ash tree surrounded by hundreds of weathered gravestones, placed there by a young Thomas Hardy",
        s3_audio_filename: "Hardy_Tree.mp3",
        s3_photo_filename: "Hardy_Tree.jpg",
        geom: st.geomFromText('Point(-0.1309 51.5349)', 4326)
      });
    });
};
