import Resource from '../framework/Resource'

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
      .catch(err => response.send(409, err))
      .finally(next)
  }
}
