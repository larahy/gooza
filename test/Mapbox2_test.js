import { database, log } from './spec_helper'
import { expect } from 'chai'
import { head } from 'lodash'
const mapboxToken = process.env.MAPBOX_TOKEN
const MapboxSDK = require('mapbox')
const mapboxClient = new MapboxSDK(mapboxToken);

import Mapbox from '../server/support/mapbox'

describe('Mapbox', () => {
  let mapbox

  beforeEach(() => {
    mapbox = new Mapbox({log, mapboxClient})
  })

  it('should return coordinates of an address', async () => {

    const coords = await mapbox.geocodeAddress('St Clement Danes Church, Strand, London, UK')
    expect(coords).to.be.an('array')
    expect(coords).deep.equal([ -0.113898, 51.513107 ])
  })

})
