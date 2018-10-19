import Promise from 'bluebird'
import { hash } from 'passport-local-authenticate'

const hashPassword = (password) => {
  const hashPasswordFor = Promise.promisify(hash)

  return hashPasswordFor(password)
}

exports.seed = function (knex, Promise) {

  return knex('users').del()
    .then(hashPassword('catdogsrule'))
    .then(hashedPassword => {
      return knex('users').insert({
        first_name: "Cat",
        last_name: "Dog",
        email: "catdog@gmail.com",
        password: hashedPassword,
        bio: 'Original Catdog'
      });
    })
};