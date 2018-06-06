import Promise from 'bluebird'

export default class Mapbox {
  constructor ({log, mapboxClient,}) {
    this.mapboxClient = mapboxClient
    this.log = log
  }

  geocodeAddress (address) {
    return this.mapboxClient.geocodeForward(address, {limit: 2})
      .then(results => {
        return results.entity.features[0].geometry.coordinates
      })
  }

}