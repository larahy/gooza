import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

const promisifiedJwt = Promise.promisifyAll(jwt)

export default class Tokens {
  constructor ({log, tokenSecret}) {
    this.log = log
    this.secret = tokenSecret
  }

  sign (content) {
    return promisifiedJwt.signAsync(content, this.secret, {expiresIn: "7 days"})
  }

  verify (content) {
    return promisifiedJwt.verifyAsync(content, this.secret)
  }
}