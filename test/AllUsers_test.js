import { database, log } from './spec_helper'
import { expect } from 'chai'
import { head } from 'lodash'

import AllUsers from '../server/users/AllUsers'

describe('AllUsers', () => {
  let allUsers

  beforeEach(() => {
    allUsers = new AllUsers({log})
  })

  const aUserJson = {
    first_name: "Brenda",
    last_name: "Chan",
    email: "brenda@example.com",
    password: "brenda"
  };
  const anotherUserJson = {
    first_name: "Norman",
    last_name: "Chan",
    email: "norman@example.com",
    password: "norman"
  };

  it('adds a user', async () => {
    const user = await allUsers.add({user: aUserJson})
    expect(user.user.first_name).to.equal(aUserJson.first_name)
  })

  it('retrieves a user by email', async () => {
    const user = await allUsers.add({user: aUserJson})
    const userWithEmail = await allUsers.findByEmail({email: aUserJson.email})
    expect(userWithEmail.id).to.equal(user.user.id)
  })

  it('hashes a users password before adding a user', async () => {

    await allUsers.add({user: aUserJson})
    const createdUser = await allUsers.findByEmail({email: aUserJson.email})
    expect(createdUser.password).to.not.equal(aUserJson.password)
    expect(JSON.parse(createdUser.password)).to.contain.keys("salt", "hash")

  })

  it('returns a list of all users', async () => {
    await allUsers.add({user: aUserJson})
    await allUsers.add({user: anotherUserJson})
    const retrievedList = await allUsers.findAll()
    // there is one already from seeding
    expect(retrievedList.length).to.equal(3)
  })

})
