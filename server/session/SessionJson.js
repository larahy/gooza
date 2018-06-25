import Promise from 'bluebird'
import halson from 'halson'

export default class SessionJson {
  render (session, { router }) {
    return Promise.resolve({
      type: 'halJson',
      content: halson(session)
        .addLink('root', router.render('root'))
        .addLink('self', router.render('session'))
    })
  }
}