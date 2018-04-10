import Promise from 'bluebird'

export default class Module {
  constructor () {
    this.initialisationComplete = () => {
    }
    this.initialisationFailed = () => {
    }
    this.initialisationPromise = new Promise((resolve, reject) => {
      this.initialisationComplete = resolve
      this.initialisationFailed = reject
    })
  }

  onInitialisationComplete () {
    return this.initialisationPromise
  }

  configureMiddleware () {
  }

  configureRoutes () {
  }
}