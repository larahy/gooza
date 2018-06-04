import Resource from '../framework/Resource'
import {respondOk, respondNotFound, respondInternalServerError} from "../support/responses";
import {
  ErrorIs,
} from '../support/errors'

export default class PlacecastResource extends Resource {
  constructor ({prefix, log, allPlacecasts, placecastJson}) {
    super({prefix, log, name: 'placecast', path: '/placecasts/:placecastId'})

    log.info('Initialising single placecast resource.')
    this.log = log
    this.allPlacecasts = allPlacecasts
    this.placecastJson = placecastJson
  }

  get (request, response, next) {
    const placecastId = request.params.placecastId
    return this.allPlacecasts.findOneById({ id: placecastId })
      .then(this.renderPlacecastAsJson.bind(this))
      .then(respondOk(response))
      .catch(err => {
        if (ErrorIs.notFound(err)) {
          this.log.warn({error: err.message})
          respondNotFound(response)(err.message)
        } else {
          respondInternalServerError(response)()
        }
      })
      .finally(next)
  }

  renderPlacecastAsJson (placecast) {
    return this.placecastJson.render(placecast, { router: this.router })
  }

}