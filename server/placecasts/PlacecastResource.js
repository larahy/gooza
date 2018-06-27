import Resource from '../framework/Resource'
import {respondOk, respondNotFound, respondInternalServerError, respondInvalid} from "../support/responses";
import {
  ErrorIs,
  warnOfError
} from '../support/errors'

export default class PlacecastResource extends Resource {
  constructor ({prefix, log, placecastHandler, allPlacecasts, placecastJson}) {
    super({prefix, log, name: 'placecast', path: '/placecasts/:placecastId'})

    log.info('Initialising single placecast resource.')
    this.log = log
    this.allPlacecasts = allPlacecasts
    this.placecastJson = placecastJson
    this.placecastHandler = placecastHandler
    this.authentication = {
      'put': 'token'
    }
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

  put (request, response, next) {


    const sessionUser = request.user
    const id = request.params.placecastId
    const placecast = request.body
    const userId = placecast.user_id

    this.log.info('updating placecast by id: ', id)

    if (userId === sessionUser.id) {
    return this.placecastHandler.update({placecast, id})
      .then(this.renderPlacecastAsJson.bind(this))
      .then(respondOk(response))
      .catch(err => {
        if (ErrorIs.notFound(err)) {
          this.log.warn({error: err.message})
          respondNotFound(response)(err.message)
        } else if (ErrorIs.invalidPlacecast(err)) {
          this.log.warn({error: err.detail}, 'Mandatory data missing or incorrect format')
          respondInvalid(response)({message: err.message, validationResult: err.validationResult})
        } else {
          respondInternalServerError(response)()
        }
      })
      .finally(next)
    } else {
      return Promise.try(respondForbidden(response))
        .catch(warnOfError('Unauthorised request to update placecast for user', this.log))
        .finally(next)
    }
  }

  del (request, response, next) {
    const id = request.params.placecastId
    this.log.info('deleting placecast by id: ', id)

    return this.allPlacecasts.deleteById({id})
      .then(() => {
        return respondOk(response)({})
      })
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