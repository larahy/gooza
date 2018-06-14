import Promise from 'bluebird'
import halson from 'halson'

export default class UserJson {

  render (user, {router}) {
    const selfUri = router.render('user', {userId: user.id})

    return Promise.resolve({
      type: 'halJson',
      location: selfUri,
      content: halson(user)
        .addLink('root', router.render('root'))
        .addLink('self', selfUri)
    })
  }
}