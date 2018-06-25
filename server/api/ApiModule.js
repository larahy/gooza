import halson from 'halson'
const MapboxClient = require('mapbox')
import Module from '../framework/Module'
import PlacecastsModule from '../placecasts/index'
import UsersModule from '../users/index'
import SessionModule from '../session/index'
const serveStatic = require('restify').plugins.serveStatic
const env = process.env.NODE_ENV || "production";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);



export default class ApiModule extends Module {
  constructor ({prefix = '/api/v1', log, mapboxToken }) {
    super()
    this.prefix = prefix
    this.log = log
    this.log.info('Starting up API module.')
    const mapboxClient = new MapboxClient(mapboxToken);
    this.placecasts = new PlacecastsModule({prefix, log, mapboxClient})
    this.users = new UsersModule({prefix, log})
    this.session = new SessionModule({prefix, log})
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
    this.users.configureRoutes({ server })
    this.session.configureRoutes({ server })

    server.get({name: 'root', path: this.prefix }, (request, response, next) => {
      let resource = halson({})
        .addLink('self', server.router.render('root'))
        .addLink('placecasts', server.router.render('placecasts'))
        .addLink('placecast', {
          href: `${server.router.render('placecast', { placecastId: '' })}{placecastId}`,
          templated: true
        })
        .addLink('users', server.router.render('users'))
        .addLink('session', server.router.render('session'))

      response.json(resource)
      next()
    })

    return server
  }
}