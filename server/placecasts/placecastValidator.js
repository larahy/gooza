import {validator as validatorFactory, Assert} from 'validator.js'
import LatLong from '../support/latLong'

export const is = Assert
  .extend({
  LatLong
  })

export const validatePlacecast = placecast => {

  const rules = {
    title: is.notBlank(),
    subtitle: is.notBlank(),
    coordinates: is.LatLong()
  }

  return validatorFactory().validate(placecast, rules)

}
