import Promise from 'bluebird'
import {validatePlacecast} from './placecastValidator'
import { ValidationError } from '../support/errors'
import {toErrorMessage} from "../support/mappers";

export default class PlacecastHandler {
  constructor ({log, allPlacecasts,}) {
    this.allPlacecasts = allPlacecasts
    this.log = log
  }

  create (context) {
    const { placecast } = context

    const validationResult = validatePlacecast(placecast)
 const errorMessage = toErrorMessage(validationResult)
    if (validationResult !== true) {
      this.log.warn(
        { errorMessage },
        'Data missing or invalid'
      )
      return Promise.reject(new ValidationError('Data missing or invalid', errorMessage))
    }
    return this.allPlacecasts.add({placecast})
  }

  update (context) {
    const { placecast, id } = context

    const validationResult = validatePlacecast(placecast)
    const errorMessage = toErrorMessage(validationResult)
    if (validationResult !== true) {
      this.log.warn(
        { errorMessage },
        'Data missing or invalid'
      )
      return Promise.reject(new ValidationError('Data missing or invalid', errorMessage))
    }
    return this.allPlacecasts.fullUpdateById({ id, placecast })
  }

}