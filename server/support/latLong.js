import {Validator, Violation, Assert as is} from 'validator.js'
import validator from 'validator'

export default function latLongAssert () {
  this.__class__ = 'LatLong'

  this.validate = value => {
    const latLong = `${value[1]},${value[0]}`
    // if (typeof value !== 'string') {
    //   throw new Violation(this, value, {
    //     value: Validator.errorCode.must_be_a_string
    //   })
    // }

    if (!validator.isLatLong(latLong)) {
      throw new Violation(this, value)
    }

    return true
  }

  return this
}