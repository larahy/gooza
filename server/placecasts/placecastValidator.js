import {validator as validatorFactory, Assert} from 'validator.js'

import LatLong from '../support/latLong'
import Integer from '../support/Integer'

export const is = Assert
  .extend({
  LatLong,
    Integer
  })

export const validatePlacecast = placecast => {

  const rules = {
    title: is.notBlank(),
    subtitle: is.notBlank(),
    coordinates: is.LatLong(),
    s3_audio_filename: is.notBlank(),
    user_id: is.Integer()
  }

  return validatorFactory().validate(placecast, rules)

}
