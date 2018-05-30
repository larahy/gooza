import Promise from 'bluebird'
import {validatePlacecast} from './placecastValidator'
import { ValidationError } from '../support/errors'

export default class CreatePlacecast {
  constructor ({log, allPlacecasts,}) {
    this.allPlacecasts = allPlacecasts
    this.log = log
  }

  create (context) {
    const { placecast } = context

    const validationResult = validatePlacecast(placecast)

    if (validationResult !== true) {
      this.log.warn(
        { validationResult },
        'Data missing or invalid'
      )
      return Promise.reject(new ValidationError('Data missing or invalid', validationResult))
    }
    return this.allPlacecasts.add({placecast})
  }

}
