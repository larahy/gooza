import Resource from '../framework/Resource'
import {
  ErrorIs,
} from '../support/errors'
import {respondOk, respondCreated, respondConflict, respondInvalid, respondInternalServerError} from "../support/responses";

export default class PlacecastsResource extends Resource {
  constructor({prefix, log, createPlacecast, allPlacecasts, placecastJson, placecastsJson}) {
    super({prefix, name: 'placecasts', path: '/placecasts'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.createPlacecast = createPlacecast
    this.allPlacecasts = allPlacecasts
    this.placecastJson = placecastJson
    this.placecastsJson = placecastsJson
  }

  post(request, response, next) {

    return this.createPlacecast.create({placecast: request.body})
      .then(({placecast}) => this.renderPlacecastAsJson.bind(this)(placecast))
      .then(respondCreated(response))
      .catch(err => {
        if (ErrorIs.duplicatePlacecast(err)) {
          this.log.warn({error: err.detail}, 'Duplicate placecast')
          respondConflict(response)('A placecast with that title already exists')
        } else if (ErrorIs.invalidPlacecast(err)) {
          this.log.warn({error: err.detail}, 'Mandatory data missing')
          respondInvalid(response)({message: err.message, validationResult: err.validationResult})
        }
        else {
          respondInternalServerError(response)()
        }
      })
      .finally(next)
  }

  get(request, response, next) {

    return this.allPlacecasts.findAll({ title: request.query.title })
      .then(this.renderPlacecastsAsJson.bind(this))
      .then(respondOk(response))
      .catch(err => {
        respondInternalServerError(response)()
      })
      .finally(next)
  }

  renderPlacecastAsJson(placecast) {
    return this.placecastJson.render(placecast, {router: this.router})
  }

  renderPlacecastsAsJson (placecasts) {
    return this.placecastsJson.render(placecasts, { router: this.router })
  }

}

