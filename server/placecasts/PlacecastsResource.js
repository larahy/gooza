import Resource from '../framework/Resource'
import {
  ErrorIs,
} from '../support/errors'
import {respondCreated} from "../support/responses";

export default class PlacecastsResource extends Resource {
  constructor({prefix, log, createPlacecast, allPlacecasts, placecastJson}) {
    super({prefix, name: 'placecasts', path: '/placecasts'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.createPlacecast = createPlacecast
    this.allPlacecasts = allPlacecasts
    this.placecastJson = placecastJson
  }

  post (request, response, next) {

    return this.createPlacecast.create({ placecast: request.body })
      .then(({placecast}) => this.renderPlacecastAsJson.bind(this)(placecast))
      .then(respondCreated(response))
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

  renderPlacecastAsJson (placecast) {
    return this.placecastJson.render(placecast, { router: this.router })
  }

}

