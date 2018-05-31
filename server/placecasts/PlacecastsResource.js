import Resource from '../framework/Resource'
import Promise from 'bluebird'
import {
  ErrorIs,
} from '../support/errors'

export default class PlacecastsResource extends Resource {
  constructor({prefix, log, createPlacecast, allPlacecasts}) {
    super({prefix, name: 'placecasts', path: '/placecasts'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.createPlacecast = createPlacecast
    this.allPlacecasts = allPlacecasts
  }

  post (request, response, next) {

    return this.createPlacecast.create({ placecast: request.body })
      .then((results) => {
        return response.send(201, results)
      })
      .catch(err => {
        if (ErrorIs.duplicatePlacecast(err)) {
          this.log.warn({error: err.detail}, 'Duplicate placecast')
          return response.send(409, {code: err.constraint, message: 'A placecast with this title already exists'})
        } else if (ErrorIs.invalidPlacecast(err)) {
          return response.send(400, {code: err.code, message: err.message})
        }
        else {
          return response.send(500)
        }})
      .finally(next)
  }

  get (request, response, next) {

    return this.allPlacecasts.findAll()
      .then((results) => {
        return response.send(200, results)
      })
      .catch(err => {
        return response.send(500)
      })
      .finally(next)
  }

}

