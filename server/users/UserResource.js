import Promise from 'bluebird'
import Resource from '../framework/Resource'
import {
  respondOk,
  respondInternalServerError,
  respondForbidden
} from '../support/responses'
import {
  warnOfError
} from '../support/errors'

export default class UserResource extends Resource {
  constructor ({ prefix, log, allUsers, userJson }) {
    super({ prefix, log, name: 'user', path: '/users/:userId' })

    log.info('Starting up resource: ' + this.name)

    this.log = log
    this.allUsers = allUsers
    this.userJson = userJson
    this.authentication = {
      'get': 'token'
    }
  }

  get (request, response, next) {
    const userToGet = parseInt(request.params.userId)
    const sessionUser = request.user

    if (userToGet === sessionUser.id) {
      return this.allUsers.findById({ id: userToGet })
        .then(this.renderUserAsJson.bind(this))
        .then(respondOk(response))
        .catch(error => {
          warnOfError('fetching user', this.log)(error)
          respondInternalServerError(response)()
        })
        .finally(next)
    } else {
      return Promise.try(respondForbidden(response))
        .catch(warnOfError('Unauthorised request to GET user', this.log))
        .finally(next)
    }
  }

  renderUserAsJson (user) {
    return this.userJson.render(user, { router: this.router })
  }
}
