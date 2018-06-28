import {Violation} from 'validator.js'
import validator from 'validator'

export default function latLongAssert () {
  this.__class__ = 'LatLong'

  this.validate = value => {
    if (typeof value !== 'object' || value.length !== 2) {
      throw new Violation(this, value, {value: 'must_be_a_pair_of_coordinates'})
    }
    const latLong = `${value[1]},${value[0]}`
    if (!validator.isLatLong(latLong)) {
      throw new Violation(this, value, {value: 'must_be_valid_coordinates'})
    }

    return true
  }

  return this
}