import Promise from 'bluebird'
import halson from 'halson'

export default class PlacecastJson {

  render (placecast, {router}) {
    // console.log('the router in pj', router)
    const selfUri = router.render('placecasts')

      return Promise.resolve({
        type: 'halJson',
        location: selfUri,
        content: halson(placecast[0])
          .addLink('root', router.render('root'))
      })
    }
}