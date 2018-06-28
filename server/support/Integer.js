import {Violation} from 'validator.js'
import validator from 'validator'

export default function integerAssert () {
  this.__class__ = 'Integer'

  this.validate = value => {
    if (!validator.isInt(value + '')) {
      throw new Violation(this, value, {value: 'must_be_an_integer'})
    }

    return true
  }

  return this
}