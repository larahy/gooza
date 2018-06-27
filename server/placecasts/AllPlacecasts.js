import {NotFoundError} from "../support/errors";

const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const knexPostgis = require('knex-postgis');
const st = knexPostgis(knex);
import {toRecords, toRecord} from "../support/mappers";

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
      geom: st.geomFromText(`Point(${long} ${lat})`, 4326),
      user_id: placecast.user_id
    }, ['id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'), 'user_id'])
      .then(placecast => {
        return toRecord(placecast[0])
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
    return knex.select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'), 'user_id').from('placecasts')
      .then(results => {
        return toRecords(results)
      })
  }

  findOneById ({id}) {
    this.log.info('Selecting placecast by ID')
    return knex("placecasts")
      .select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'), 'user_id')
      .where({ id })
      .then(placecast => {
        if (!placecast.length) {
          throw new NotFoundError("The requested placecast does not exist");
        }
        const returnable = toRecord(placecast[0])
        return returnable
      })
  }

  findByTitle ({ title }) {

    this.log.info('Selecting placecasts by title')
    return knex("placecasts")
      .select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'), 'user_id')
      .whereRaw('LOWER(title) LIKE ?', '%'+title.toLowerCase()+'%')
      .then(results => {
        return toRecords(results)
      })
  }

  findByProximityTo({ lat, long, radius }) {

    this.log.info('Selecting placecasts by proximity')
    return knex("placecasts")
      .select('id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'), 'user_id')
      .whereRaw(`ST_DWithin(geom, ST_MakePoint(${long},${lat})::geography, ${radius})`)
      .then(results => {
        return toRecords(results)
      })
  }

  fullUpdateById ({id, placecast}) {
    const lat = placecast.coordinates[1]
    const long = placecast.coordinates[0]
    this.log.info('Updating placecast')
    return knex("placecasts")
      .update({
        title: placecast.title,
        subtitle: placecast.subtitle,
        s3_audio_filename: placecast.s3_audio_filename,
        geom: st.geomFromText(`Point(${long} ${lat})`, 4326),
        user_id: placecast.user_id
      }, ['id', 'title', 'subtitle', 's3_audio_filename', st.asGeoJSON('geom'), 'user_id'])
      .where({ id })
      .then(placecast => {
        if (!placecast.length) {
          throw new NotFoundError("The requested placecast does not exist");
        }
        this.log.info('Successfully updated placecast: ' + placecast[0].title)
        return toRecord(placecast[0])
      })

  }

  deleteById ({id}) {
    this.log.info('deleting placecast by id: ', id)
    return knex("placecasts")
      .where({id})
      .del()
  }

}
