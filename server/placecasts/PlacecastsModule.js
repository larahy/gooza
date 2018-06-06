import Module from '../framework/Module'
import PlacecastsResource from './PlacecastsResource'
import PlacecastResource from './PlacecastResource'
import AllPlacecasts from './AllPlacecasts'
import CreatePlacecast from './createPlacecast'
import Mapbox from '../support/mapbox'
import FindPlacecasts from './findPlacecasts'
import PlacecastJson from './PlacecastJson'
import PlacecastsJson from './PlacecastsJson'

export default class PlacecastsModule extends Module {
  constructor ({prefix, log, mapboxClient}) {
    super()
    const placecastJson = new PlacecastJson()
    const placecastsJson = new PlacecastsJson({placecastJson})
    const allPlacecasts = new AllPlacecasts({log})
    const mapbox = new Mapbox({log, mapboxClient})
    const createPlacecast = new CreatePlacecast({log, allPlacecasts})
    const findPlacecasts = new FindPlacecasts({log, allPlacecasts, mapbox})
    this.placecastsResource = new PlacecastsResource({
      prefix, log, createPlacecast, allPlacecasts, placecastJson, placecastsJson, findPlacecasts
    })
    this.placecastResource = new PlacecastResource({
      prefix, log, allPlacecasts, placecastJson,
    })
  }

  configureRoutes ({server}) {
    this.placecastsResource.configureRoutes({server})
    this.placecastResource.configureRoutes({server})
    return server
  }
}
