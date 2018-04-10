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
        return placecastId
      })
      .catch(error => {
        this.log.info(error)
        return error
      })
  }


}
