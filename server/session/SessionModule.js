import Module from '../framework/Module'
import SessionResource from './SessionResource'
import SessionJson from './SessionJson'

export default class SessionModule extends Module {
  constructor ({prefix, log}) {
    super()

    log.info('Starting up session module.')

    const sessionJson = new SessionJson()

    this.sessionResource = new SessionResource({
      prefix, log, sessionJson
    })
  }

  configureRoutes ({server}) {
    this.sessionResource.configureRoutes({server})

    return server
  }
}