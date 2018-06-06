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
    const lat = placecast.coordinates[1]
    const long = placecast.coordinates[0]

    this.log.info('Creating a new placecast:', placecast.title)
    return knex("placecasts").insert({
      title: placecast.title,
      subtitle: placecast.subtitle,
      s3_audio_filename: placecast.s3_audio_filename,
      geom: st.geomFromText(`Point(${long} ${lat})`, 4326)
    }, ['id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom')])
      .then(placecast => {
        return toPlacecast(placecast[0])
      })
      .then(placecast => {
        this.log.info('Successfully created placecast: ' + placecast.title)
        return {placecast}
      })
  }

  findAll (params) {
    const title = params.title
    const lat = params.lat
    const long = params.long
    const radius = params.radius
    if (title) {
      return this.findByTitle({title})
    } else if (lat && long) {
      return this.findByProximityTo({lat, long, radius})
    }
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
        return toPlacecasts(results)
      })
  }

  findByProximityTo({ lat, long, radius }) {

    this.log.info('Selecting placecasts by proximity')
    return knex("placecasts")
      .select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'))
      .whereRaw(`ST_DWithin(geom, ST_MakePoint(${long},${lat})::geography, ${radius})`)
      .then(results => {
        return toPlacecasts(results)
      })
  }

}
