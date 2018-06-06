import Promise from 'bluebird'
import {validatePlacecast} from './placecastValidator'
import { ValidationError } from '../support/errors'

export default class FindPlacecasts {
  constructor ({log, allPlacecasts, mapbox}) {
    this.allPlacecasts = allPlacecasts
    this.mapbox = mapbox
    this.log = log
  }

  findAll (context) {
    const { params } = context
    const address = params.address
    if (address) {
      return this.mapbox.geocodeAddress(address)
        .then((coordinates) => {
          const long = coordinates[0]
          const lat = coordinates[1]
        console.log('the returned coords', lat, long)
        return this.allPlacecasts.findAll({...params, lat, long})
        })
    }
    return this.allPlacecasts.findAll(params)
  }

}
