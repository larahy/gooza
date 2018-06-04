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
    coordinates: [-0.187682, 51.472303],
    s3_audio_file: "twinings_tea.mp3"
  };

  const anotherPlacecastJson = {
    title: "Hamleys Toy Shop",
    subtitle: " bla bla",
    coordinates: [-0.187682, 51.472303],
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
})
