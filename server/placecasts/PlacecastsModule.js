import Module from '../framework/Module'
import PlacecastsResource from './PlacecastsResource'
import AllPlacecasts from './AllPlacecasts'

export default class PlacecastsModule extends Module {
  constructor ({prefix, log}) {
    super()
    const allPlacecasts = new AllPlacecasts({log})
    this.placecastsResource = new PlacecastsResource({
      prefix, log, allPlacecasts
    })
  }

  configureRoutes ({server}) {
    this.placecastsResource.configureRoutes({server})
    return server
  }
}
