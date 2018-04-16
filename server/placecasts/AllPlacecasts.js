const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

export default class AllPlacecasts {

  constructor ({log}) {
    this.log = log
  }

  create ({placecast}) {
    this.log.info('Creating a new placecast:', placecast.title)
    return knex("placecasts").insert(placecast, ['id'])
      .then(placecast => {
        const placecastId = placecast[0]
        this.log.info('Successfully created placecast: ' + placecastId.id)
        return placecastId
      })
  }

}
