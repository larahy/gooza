import Resource from '../framework/Resource'
import {
  ErrorIs,
} from '../support/errors'
import {respondOk, respondCreated, respondConflict, respondInvalid, respondInternalServerError} from "../support/responses";

export default class UsersResource extends Resource {
  constructor({prefix, log, allUsers, userJson}) {
    super({prefix, name: 'users', path: '/users'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.allUsers = allUsers
    this.userJson = userJson
    this.authentication = {
      'get': 'local'
    }

  }

  post(request, response, next) {

    return this.allUsers.add({user: request.body})
      .then(({user}) => this.renderUserAsJson.bind(this)(user))
      .then(respondCreated(response))
      .catch(() => {
        respondInternalServerError(response)()
      })
      .finally(next)
  }

  get(request, response, next) {
    // const userSession = request.user
    // console.log(userSession)
    return this.allUsers.findAll()
      .then((results) => {
        return response.send(200, results)
      })
      .catch(() => {
        respondInternalServerError(response)()
      })
      .finally(next)
  }


  renderUserAsJson(user) {
    return this.userJson.render(user, {router: this.router})
  }

}

