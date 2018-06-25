import passport from 'passport'
import Promise from 'bluebird'
import {verify} from 'passport-local-authenticate'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as TokenStrategy} from 'passport-accesstoken'

import {isEmpty, omit} from 'lodash'
import AllUsers from '../users/AllUsers'

import Module from '../framework/Module'

const verifyPassword = Promise.promisify(verify)

export default class AuthenticationModule extends Module {
  constructor ({log, tokens}) {
    super()

    this.log = log
    this.tokens = tokens

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
              return this.tokens.sign({id: user.id})
                .then(token => done(null, {user, token}))
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

    passport.use(new TokenStrategy(
      (token, done) => {
        log.debug({token}, 'Attempting authentication')
        return this.tokens.verify(token)
          .tap(contents => log.debug({contents}, 'Finding account...'))
          .then(contents => allUsers.findById({ id: contents.id }))
          .tap(user => log.info('Logging in by token...', {userId: user.id}))
          .then(user => user
            ? done(null, {...user, token})
            : done(null, false))
          .catch(error => {
            log.warn({error, stack: error.stack}, 'Encountered error during token authentication.')
            return done(null, false)
          })
      }
    ))


    this.initialisationComplete()
  }

  configureMiddleware ({server}) {
    return server
      .use(passport.initialize())
      .use(passport.authenticate(['token', 'local'], {session: false}))
  }
}
