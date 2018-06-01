import Module from '../framework/Module'
import PlacecastsResource from './PlacecastsResource'
import PlacecastResource from './PlacecastResource'
import AllPlacecasts from './AllPlacecasts'
import CreatePlacecast from './createPlacecast'
import PlacecastJson from './PlacecastJson'

export default class PlacecastsModule extends Module {
  constructor ({prefix, log}) {
    super()
    const placecastJson = new PlacecastJson()
    const allPlacecasts = new AllPlacecasts({log})
    const createPlacecast = new CreatePlacecast({log, allPlacecasts})
    this.placecastsResource = new PlacecastsResource({
      prefix, log, createPlacecast, allPlacecasts, placecastJson
    })
    this.placecastResource = new PlacecastResource({
      prefix, log, allPlacecasts, placecastJson
    })
  }

  configureRoutes ({server}) {
    this.placecastsResource.configureRoutes({server})
    this.placecastResource.configureRoutes({server})
    return server
  }
}
