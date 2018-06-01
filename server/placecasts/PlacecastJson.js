import Promise from 'bluebird'
import halson from 'halson'

export default class PlacecastJson {

  render (placecast, {router}) {
    const selfUri = router.render('placecast', {placecastId: placecast.id})

      return Promise.resolve({
        type: 'halJson',
        location: selfUri,
        content: halson(placecast)
          .addLink('root', router.render('root'))
          .addLink('self', selfUri)
      })
    }
}