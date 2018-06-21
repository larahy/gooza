import ApiModule from './api'
import AuthenticationModule from './authentication'

import restify from 'restify'
const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})
export default class Server {
  constructor ({port, log, mapboxToken}) {

    this.port = port
    this.log = log
    this.server = restify.createServer({})
    this.server.pre(cors.preflight)
    this.server.use(cors.actual)
      this.server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
      this.server.use(restify.plugins.acceptParser(this.server.acceptable))
      this.server.use(restify.plugins.queryParser({ mapParams: true }))
      this.server.use(restify.plugins.fullResponse())

    const api = new ApiModule({log, mapboxToken})
    const authentication = new AuthenticationModule({log})

    api.configureRoutes({server: this.server})
    authentication.configureMiddleware({server: this.server})
    this.initialisationPromise = api.onInitialisationComplete()
  }

  onInitialisationComplete () {
    return this.initialisationPromise
  }

  listen (callback = () => {}) {
    return this.server.listen(
      this.port,
      () => {
        this.log.info(`Listening on http://localhost:${this.port}`)
        callback()
      })
  }

  close (callback = () => {}) {
    this.server.close(
      () => {
        this.log.info('Shutting down server.')
        callback()
      })
  }

}