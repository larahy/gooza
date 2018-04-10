exports.seed = function (knex, Promise) {
    return knex('placecasts').del() // Deletes ALL existing entries
        .then(function () { // Inserts seed entries one by one in series
            return knex('placecasts').insert({
              title: "Highgate Cemetary",
              subtitle: "Once the site of dueling magicians and mobs of stake-carrying vampire hunters, now the burial ground of Karl Marx, Douglas Adams and James Holman",
              lat: 51.5675,
              long: -0.1483,
              address: "Swain\'s Lane, Highgate\n" +
              "London, England, N6\n" +
              "United Kingdom"
            });
        }).then(function () {
            return knex('placecasts').insert({
              title: "The Hardy Tree",
              subtitle: "An ash tree surrounded by hundreds of weathered gravestones, placed there by a young Thomas Hardy",
              lat: 51.5349,
              long: -0.1309,
              address: "Pancras Road\n" +
              "London, England, NW1 1UL\n" +
              "United Kingdom"
            });
        });
};