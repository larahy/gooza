import { database, log } from './spec_helper'
import { expect } from 'chai'
import { head } from 'lodash'
import {buildPlacecast} from "./helpers/builders";
import AllPlacecasts from '../server/placecasts/AllPlacecasts'
import AllUsers from '../server/users/AllUsers'

describe('AllPlacecasts', () => {
  let allPlacecasts
  let allUsers
  let catdogId

  beforeEach(async () => {
    allPlacecasts = new AllPlacecasts({log})
    allUsers = new AllUsers({log})
    catdogId = await allUsers.findByEmail({email: 'catdog@gmail.com'})
  })


  it('adds a placecast', async () => {
    const aPlacecastJson = buildPlacecast({user_id: catdogId.id});
    const placecast = await allPlacecasts.add({placecast: aPlacecastJson})
    const createdPlacecast = await allPlacecasts.findOneById({id: placecast.placecast.id})
    expect(createdPlacecast.title).to.equal(aPlacecastJson.title)
    expect(createdPlacecast.user_id).to.equal(aPlacecastJson.user_id)
  })

  it('selects placecasts by title', async () => {
    const anotherPlacecastJson = buildPlacecast({
      title: "Hamleys Toy Shop",
      coordinates: [-0.1402, 51.5128],
      s3_audio_filename: "hamleys_toys.mp3",
      user_id: catdogId.id
    });

    const aPlacecastJson = buildPlacecast({user_id: catdogId.id});
    await allPlacecasts.add({placecast: aPlacecastJson})
    await allPlacecasts.add({placecast: anotherPlacecastJson})
    const placecastsWithShopInTitle = await allPlacecasts.findByTitle({title: 'shop'})
    expect(placecastsWithShopInTitle.length).to.equal(2)
  })

  it('selects all placecasts within a given radius of a set of coordinates', async () => {
    const long = 0.1383
    const lat = 51.5666
    const aPlacecastJson = buildPlacecast({user_id: catdogId.id});
    const anotherPlacecastJson = buildPlacecast({
      title: "Hamleys Toy Shop",
      coordinates: [-0.1402, 51.5128],
      s3_audio_filename: "hamleys_toys.mp3",
      user_id: catdogId.id
    });

    await allPlacecasts.add({placecast: aPlacecastJson})
    await allPlacecasts.add({placecast: anotherPlacecastJson})
    const placecastsWithin25km = await allPlacecasts.findByProximityTo({lat, long, radius: 25000})
    expect(placecastsWithin25km.length).to.equal(4)

    const placecastsWithin20km = await allPlacecasts.findByProximityTo({lat, long, radius: 20000})
    expect(placecastsWithin20km.length).to.equal(3)
  })

  it('updates a placecast in its entirety', async () => {
    const updatePlacecastJson = {
      title: "Twinings Tea Party",
      subtitle: " bla bla",
      coordinates: [ -0.1128, 51.5133 ],
      s3_audio_file: "twinings_tea_party.mp3",
      user_id: catdogId.id
    };
    const aPlacecastJson = buildPlacecast({user_id: catdogId.id});
    const originalPlacecast = await allPlacecasts.add({placecast: aPlacecastJson})
    await allPlacecasts.fullUpdateById({id: originalPlacecast.placecast.id, placecast: updatePlacecastJson})
    const updatedPlacecast = await allPlacecasts.findOneById({id: originalPlacecast.placecast.id})
    expect(updatedPlacecast.title).to.equal(updatePlacecastJson.title)
    expect(updatedPlacecast.user_id).to.equal(aPlacecastJson.user_id)
  })

  it('deletes a placecast', async () => {
    const aPlacecastJson = buildPlacecast({user_id: catdogId.id});
    const originalPlacecast = await allPlacecasts.add({placecast: aPlacecastJson})
    const noOfDeletions = await allPlacecasts.deleteById({id: originalPlacecast.placecast.id})
    expect(noOfDeletions).to.equal(1)
    try {
      await allPlacecasts.findOneById({id: originalPlacecast.placecast.id})
    }
    catch (error) {
      expect(error.message).to.equal('The requested placecast does not exist')
    }
  })
})
