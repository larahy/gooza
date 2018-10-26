import Resource from '../framework/Resource'
import {
  ErrorIs, warnOfError
} from '../support/errors'
import {respondOk, respondCreated, respondConflict, respondInvalid, respondInternalServerError, respondForbidden} from "../support/responses";

export default class PlacecastsResource extends Resource {
  constructor({prefix, log, placecastHandler, allPlacecasts, placecastJson, placecastsJson, findPlacecasts}) {
    super({prefix, name: 'placecasts', path: '/placecasts'})

    log.info('Starting up resource: ' + this.name)
    this.log = log
    this.placecastHandler = placecastHandler
    this.allPlacecasts = allPlacecasts
    this.placecastJson = placecastJson
    this.placecastsJson = placecastsJson
    this.findPlacecasts = findPlacecasts
    this.authentication = {
      'post': 'token'
    }
  }

  post(request, response, next) {

    const sessionUser = request.user
    const userId = request.body.user_id
    this.log.info('Creating placecast for ', { userId: userId })


    if (userId === sessionUser.id && sessionUser.active === true) {
    return this.placecastHandler.create({placecast: request.body})
      .then(({placecast}) => this.renderPlacecastAsJson.bind(this)(placecast))
      .then(respondCreated(response))
      .catch(err => {
        if (ErrorIs.duplicatePlacecast(err)) {
          this.log.warn({error: err.detail}, 'Duplicate placecast')
          respondConflict(response)('A placecast with that title already exists')
        } else if (ErrorIs.invalidPlacecast(err)) {
          this.log.warn({error: err.detail}, 'Mandatory data missing or data invalid')
          respondInvalid(response)({message: err.message, validationResult: err.validationResult})
        }
        else {
          respondInternalServerError(response)()
        }
      })
      .finally(next)
    } else {
      return Promise.try(respondForbidden(response))
        .catch(warnOfError('Unauthorised request to create new placecast for user', this.log))
        .finally(next)
    }
  }

  get(request, response, next) {
    return this.findPlacecasts.findAll({params: request.query})
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

