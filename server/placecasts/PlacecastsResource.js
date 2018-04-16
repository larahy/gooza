import Resource from '../framework/Resource'
import {
  ErrorIs
} from '../support/errors'

export default class PlacecastsResource extends Resource {
  constructor ({prefix, log, allPlacecasts}) {
    super({prefix, name: 'placecasts', path: '/placecasts'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.allPlacecasts = allPlacecasts
  }

  post (request, response, next) {
    return this.allPlacecasts.create({ placecast: request.body })
      .then((results) => {
        return response.send(201, results)
      })
      .catch(err => {
        if (ErrorIs.duplicatePlacecast(err)) {
          this.log.warn({error: err.detail}, 'Duplicate placecast')
          return response.send(409, {code: err.constraint, message: 'A placecast with this title already exists'})
        }
        else {
          return response.send(500)
        }})
      .finally(next)
  }
}

