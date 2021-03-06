import {NotFoundError} from "../support/errors";
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
import Promise from 'bluebird'
import { hash } from 'passport-local-authenticate'
import {toRecord, toRecords} from "../support/mappers";

export default class AllUsers {

  constructor({log}) {
    this.log = log
  }

  add({user}) {

    this.log.info('Creating a new user:', user.email)
    return this.hashPassword(user.password)
      .then(hashedPassword => {
        return knex("users").insert({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          bio: user.bio,
          active: user.active,
          password: JSON.stringify(hashedPassword)
        }, ['id', 'first_name', 'last_name', 'email', 'bio', 'active'])
      })
      .then(user => {
        return toRecord(user[0])
      })
      .then(user => {
        this.log.info('Successfully created user: ' + user.email)
        return {user}
      })
  }

  findByEmail({email}) {
    this.log.info('Retrieving user by email: ', email)
    return knex("users")
      .select('id', 'first_name', 'last_name', 'email', 'bio', 'password')
      .where({email})
      .then(user => {
        if (!user.length) {
          throw new NotFoundError("The requested user does not exist");
        }
        this.log.info('Successfully retrieved user: ' + user[0].email)
        return user[0]
      })
  }

  findById({id}) {
    this.log.info('Retrieving user by id: ', id)
    return knex("users")
      .select('id', 'first_name', 'last_name', 'email', 'bio', 'active')
      .where({id})
      .then(user => {
        if (!user.length) {
          throw new NotFoundError("The requested user does not exist");
        }
        this.log.info('Successfully retrieved user: ' + user[0].email)
        return user[0]
      })
  }

  findAll () {
    this.log.info('Finding all users')
    return knex.select('id', 'first_name', 'last_name', 'bio', 'active').from('users')
      .then(results => {
        return toRecords(results)
      })
  }

  hashPassword (password) {
    const hashPasswordFor = Promise.promisify(hash)

    return hashPasswordFor(password)
  }

}
