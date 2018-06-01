import Resource from '../framework/Resource'
import {respondOk} from "../support/responses";

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
        if (err.message === 'The requested resource does not exist') {
          return response.send(404, err)
        }
        response.send(500, err)
      })
      .finally(next)
  }

  renderPlacecastAsJson (placecast) {
    return this.placecastJson.render(placecast, { router: this.router })
  }

}