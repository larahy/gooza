import Resource from '../framework/Resource'
import {
  respondOk,
  respondInternalServerError
} from '../support/responses'
import {
  warnOfError
} from '../support/errors'

export default class SessionResource extends Resource {
  constructor ({prefix, log, sessionJson}) {
    super({prefix, log, name: 'session', path: '/session'})

    log.info('Starting up session resource.')

    this.log = log
    this.sessionJson = sessionJson
    this.authentication = {
      'post': 'local'
    }
  }

  post (request, response, next) {
    const userSession = request.user
    const userId = userSession.id
    const sessionData = { userId, token: userSession.token }
    this.log.info('User logging in', {userId})
    return this.sessionJson
      .render(sessionData, {router: this.router})
      .then(respondOk(response))
      .catch(error => {
        warnOfError('logging in', this.log)(error)
        respondInternalServerError(response)()
      })
      .finally(next)
  }
}