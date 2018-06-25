import Module from '../framework/Module'
import UsersResource from './UsersResource'
import AllUsers from './AllUsers'
import UserJson from './UserJson'
import UsersJson from './UsersJson'

export default class UsersModule extends Module {
  constructor ({prefix, log}) {
    super()
    const allUsers = new AllUsers({log})
    const userJson = new UserJson({log})
    const usersJson = new UsersJson({userJson})
    this.usersResource = new UsersResource({
      prefix, log, allUsers, userJson, usersJson
    })
  }

  configureRoutes ({server}) {
    this.usersResource.configureRoutes({server})
    return server
  }
}
