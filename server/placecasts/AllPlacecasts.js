import {NotFoundError} from "../support/errors";

const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const knexPostgis = require('knex-postgis');
const st = knexPostgis(knex);
import {toPlacecasts, toPlacecast} from "../support/mappers";

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
        return toPlacecast(placecast[0])
      })
      .then(placecast => {
        this.log.info('Successfully created placecast: ' + placecast.title)
        return {placecast}
      })
  }

  findAll () {
    this.log.info('Finding all placecasts')
    return knex.select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom')).from('placecasts')
      .then(results => {
        return toPlacecasts(results)
      })
  }

  findOneById ({id}) {
    this.log.info('Selecting placecast by ID')
    return knex("placecasts")
      .select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'))
      .where({ id })
      .then(placecast => {
        if (!placecast.length) {
          throw new NotFoundError("The requested placecast does not exist");
        }
        const returnable = toPlacecast(placecast[0])
        return returnable
      })
  }

  findByTitle ({ title }) {

    this.log.info('Selecting placecasts by title')
    return knex("placecasts")
      .select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'))
      .whereRaw('LOWER(title) LIKE ?', '%'+title.toLowerCase()+'%')
      .then(results => {
        if (!results.length) {
          throw new NotFoundError("No placecasts exist with that title");
        }
        return toPlacecasts(results)
      })
  }

  findByCity ({ city }) {

    this.log.info('Selecting placecasts by city')
    return knex("placecasts")
      .whereRaw('LOWER(title) LIKE ?', '%'+title.toLowerCase()+'%')
      .then(placecast => {
        if (!placecast.length) {
          throw new NotFoundError("No placecasts exist with that title");
        }
        const returnable = toPlacecast(placecast[0])
        return returnable
      })
  }

}
