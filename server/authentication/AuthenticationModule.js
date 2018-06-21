import passport from 'passport'
import Promise from 'bluebird'
import {verify} from 'passport-local-authenticate'
import {Strategy as LocalStrategy} from 'passport-local'

import {isEmpty, omit} from 'lodash'
import AllUsers from '../users/AllUsers'

import Module from '../framework/Module'

const verifyPassword = Promise.promisify(verify)

export default class AuthenticationModule extends Module {
  constructor ({log}) {
    super()

    this.log = log

    const allUsers = new AllUsers({log})

    log.info('Initialising authentication module.')


    passport.use(new LocalStrategy({
        passwordField: 'password',
        usernameField: 'email',
        session: false
      },
      (username, password, done) => {
        log.debug({username}, 'Attempting authentication')
        return allUsers.findByEmail({ email: username })
          .then(user => isEmpty(user)
            ? [user, false]
            : Promise.all([user, verifyPassword(password, JSON.parse(user.password))]))
          .then(([user, verified]) => {
            if (verified) {
              log.debug({user}, 'Login success.')
              return done(null, user);
            } else {
              log.warn('Invalid password supplied for', {accountId: account.id})
              return done(null, false)
            }
          })
          .catch(error => {
            log.warn({
              error,
              stack: error.stack
            }, 'Encountered error during local authentication.')
            return done(error)
          })
      }))


    this.initialisationComplete()
  }

  configureMiddleware ({server}) {
    return server
      .use(passport.initialize())
      .use(passport.authenticate(['local'], {session: false}))
  }
}
