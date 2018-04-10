import Module from './Module'

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

          this.log.info({
              method,
              name: this.name,
              path: this.path
            }, 'Configuring unauthenticated endpoint')
            server[method](opts, methodMethod.bind(this))
        }
      })

    return server
  }
}
