import Promise from 'bluebird'
import halson from 'halson'

export default class PlacecastsJson {
  constructor ({placecastJson}) {
    this.placecastJson = placecastJson
  }

  render (placecasts, { router }) {
    return Promise.map(placecasts, placecast => this.placecastJson.render(placecast, { router }).get('content'))
      .then(placecastRepresentations => {
        return {
          type: 'halJson',
          content: halson({})
            .addEmbed('placecasts', placecastRepresentations)
            .addLink('root', router.render('root'))
            .addLink('self', router.render('placecasts'))
        }
      })
  }
}
