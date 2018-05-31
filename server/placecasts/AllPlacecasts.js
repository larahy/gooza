const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const knexPostgis = require('knex-postgis');
const st = knexPostgis(knex);

export default class AllPlacecasts {

  constructor ({log}) {
    this.log = log
  }

  add ({placecast}) {
    this.log.info('Creating a new placecast:', placecast.title)
    return knex("placecasts").insert({
      title: placecast.title,
      subtitle: placecast.subtitle,
      s3_audio_filename: placecast.s3_audio_file,
      geom: st.geomFromText(`Point(${placecast.coordinates[0]} ${placecast.coordinates[1]})`, 4326)
    }, ['id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom')])
      .then(placecast => {
        const placecastId = placecast[0]
        this.log.info('Successfully created placecast: ' + placecastId.id)
        return placecastId
      })
  }

  findAll () {
    this.log.info('Finding all placecasts')
    return knex.select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom')).from('placecasts')
      .then(placecasts => {
        return placecasts
      })
  }

}
