import Module from './Module'
import passport from 'passport'

export default class Resource extends Module {
  constructor ({prefix, log, name, path}) {
    super()

    this.prefix = prefix
    this.log = log
    this.name = name
    this.path = path
    this.router = null
    this.supportedMethods = [
      'get', 'put', 'post', 'del', 'patch', 'head', 'opts'
    ];
    this.authentication = {}
  }

  configureRoutes ({server}) {
    this.router = server.router

    let isFirstMethod = true
    this.supportedMethods
      .forEach(method => {
        const methodMethod = this.constructor.prototype[method]
        if (methodMethod) {
          let opts = {path: this.prefix + this.path}

          if (isFirstMethod) {
            isFirstMethod = false
            opts = {...opts, name: this.name}
          }
          if (this.authentication[method]) {
            this.log.debug({
              method,
              name: this.name,
              path: this.path,
              authentication: this.authentication[method]
            }, 'Configuring authenticated endpoint')

            server[method](opts, passport.authenticate(this.authentication[method], {session: false}), methodMethod.bind(this))
          } else {
            this.log.debug({
              method,
              name: this.name,
              path: this.path
            }, 'Configuring unauthenticated endpoint')

            server[method](opts, methodMethod.bind(this))
          }

        }
      })

    return server
  }
}
