import { database, log } from './spec_helper'
import { expect } from 'chai'
import { head } from 'lodash'

import AllPlacecasts from '../server/placecasts/AllPlacecasts'

describe('AllPlacecasts', () => {
  let allPlacecasts

  beforeEach(() => {
    allPlacecasts = new AllPlacecasts({log})
  })

  const aPlacecastJson = {
    title: "Twinings Tea Shop",
    subtitle: "The Twinings logo, a simple, gold sign bearing the company name, has remained unchanged since 1787, \n" +
    "making it the oldest corporate logo still in use. In 1837 Queen Victoria granted the company a royal warrant, a merit \n" +
    "which has given Twinings the honor of providing tea to the royal family ever since. ",
    coordinates: [-0.1483, 51.5675],
    s3_audio_file: "twinings_tea.mp3"
  };

  const anotherPlacecastJson = {
    title: "Hamleys Toy Shop",
    subtitle: " bla bla",
    coordinates: [-0.1402, 51.5128],
    s3_audio_file: "hamleys_toys.mp3"
  };

  it('adds a placecast', async () => {
    const placecast = await allPlacecasts.add({placecast: aPlacecastJson})
    const createdPlacecast = await allPlacecasts.findOneById({id: placecast.placecast.id})
    expect(createdPlacecast.title).to.equal(aPlacecastJson.title)
  })

  it('selects placecasts by title', async () => {
    await allPlacecasts.add({placecast: aPlacecastJson})
    await allPlacecasts.add({placecast: anotherPlacecastJson})
    const placecastsWithShopInTitle = await allPlacecasts.findByTitle({title: 'shop'})
    expect(placecastsWithShopInTitle.length).to.equal(2)
  })

  it('selects all placecasts within a given radius of a set of coordinates', async () => {
    const long = 0.1383;
    const lat = 51.5666;

    await allPlacecasts.add({placecast: aPlacecastJson})
    await allPlacecasts.add({placecast: anotherPlacecastJson})
    const placecastsWithin25km = await allPlacecasts.findByProximity({long, lat, radius: 25000})
    expect(placecastsWithin25km.length).to.equal(4)

    const placecastsWithin20km = await allPlacecasts.findByProximity({long, lat, radius: 20000})
    expect(placecastsWithin20km.length).to.equal(3)
  })
})
