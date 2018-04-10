import halson from 'halson'
import Module from '../framework/Module'
import PlacecastsModule from '../placecasts/index'
const serveStatic = require('restify').plugins.serveStatic
const env = process.env.NODE_ENV || "production";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

export default class ApiModule extends Module {
  constructor ({ prefix = '/api/v1', log }) {
    super()
    this.prefix = prefix
    this.log = log
    this.log.info('Starting up API module.')
    this.placecasts = new PlacecastsModule({prefix, log})
    knex.migrate.latest()
      .then(() => {
        this.log.info('Migrations complete.')
        return this.initialisationComplete()
      })
      .catch(error => {
        throw error
      })
  }

  configureRoutes ({ server }) {

    this.placecasts.configureRoutes({ server })

    server.get({name: 'root', path: this.prefix }, (request, response, next) => {
      let resource = halson({})
        .addLink('self', server.router.render('root'))
        .addLink('placecasts', server.router.render('placecasts'))

      response.json(resource)
      next()
    })

    return server
  }
}