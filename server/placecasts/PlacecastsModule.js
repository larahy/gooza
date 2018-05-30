import Module from '../framework/Module'
import PlacecastsResource from './PlacecastsResource'
import AllPlacecasts from './AllPlacecasts'
import CreatePlacecast from './createPlacecast'

export default class PlacecastsModule extends Module {
  constructor ({prefix, log}) {
    super()
    const allPlacecasts = new AllPlacecasts({log})
    const createPlacecast = new CreatePlacecast({log, allPlacecasts})
    this.placecastsResource = new PlacecastsResource({
      prefix, log, createPlacecast
    })
  }

  configureRoutes ({server}) {
    this.placecastsResource.configureRoutes({server})
    return server
  }
}
