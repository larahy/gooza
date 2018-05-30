const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const knexPostgis = require('knex-postgis');
const st = knexPostgis(knex);

export default class AllPlacecasts {

  constructor ({log}) {
    this.log = log
  }

  create ({placecast}) {
    this.log.info('Creating a new placecast:', placecast.title)
    return knex("placecasts").insert({
      title: placecast.title,
      subtitle: placecast.subtitle,
      s3_audio_filename: placecast.s3_audio_file,
      geom: st.geomFromText(`Point(${placecast.long} ${placecast.lat})`, 4326)
    }, ['id'])
      .then(placecast => {
        const placecastId = placecast[0]
        this.log.info('Successfully created placecast: ' + placecastId.id)
        return placecastId
      })
  }

}
