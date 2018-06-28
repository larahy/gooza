import {Violation} from 'validator.js'
import validator from 'validator'

export default function latLongAssert () {
  this.__class__ = 'LatLong'

  this.validate = value => {
    if (typeof value !== 'object' || value.length !== 2) {
      throw new Violation(this, value, 'incorrect_format')
    }
    const latLong = `${value[1]},${value[0]}`
    if (!validator.isLatLong(latLong)) {
      throw new Violation(this, value, 'invalid_coordinates')
    }

    return true
  }

  return this
}