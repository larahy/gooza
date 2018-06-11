import Module from '../framework/Module'
import PlacecastsResource from './PlacecastsResource'
import PlacecastResource from './PlacecastResource'
import AllPlacecasts from './AllPlacecasts'
import PlacecastHandler from './PlacecastHandler'
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
    const placecastHandler = new PlacecastHandler({log, allPlacecasts})
    const findPlacecasts = new FindPlacecasts({log, allPlacecasts, mapbox})
    this.placecastsResource = new PlacecastsResource({
      prefix, log, placecastHandler, allPlacecasts, placecastJson, placecastsJson, findPlacecasts
    })
    this.placecastResource = new PlacecastResource({
      prefix, log, placecastHandler, allPlacecasts, placecastJson,
    })
  }

  configureRoutes ({server}) {
    this.placecastsResource.configureRoutes({server})
    this.placecastResource.configureRoutes({server})
    return server
  }
}
