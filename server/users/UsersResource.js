import Resource from '../framework/Resource'
import {
  ErrorIs,
} from '../support/errors'
import {respondOk, respondCreated, respondConflict, respondInvalid, respondInternalServerError} from "../support/responses";

export default class UsersResource extends Resource {
  constructor({prefix, log, allUsers, userJson, usersJson}) {
    super({prefix, name: 'users', path: '/users'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.allUsers = allUsers
    this.userJson = userJson
    this.usersJson = usersJson
    this.authentication = {
      'get': 'token'
    }

  }

  post(request, response, next) {

    return this.allUsers.add({user: request.body})
      .then(({user}) => this.renderUserAsJson.bind(this)(user))
      .then(respondCreated(response))
      .catch((error) => {
      console.log(error)
        respondInternalServerError(response)()
      })
      .finally(next)
  }

  get(request, response, next) {
    return this.allUsers.findAll()
      .then(this.renderUsersAsJson.bind(this))
      .then(respondOk(response))
      .catch(err => {
        respondInternalServerError(response)()
      })
      .finally(next)
  }


  renderUserAsJson(user) {
    return this.userJson.render(user, {router: this.router})
  }

  renderUsersAsJson (users) {
    return this.usersJson.render(users, { router: this.router })
  }

}

