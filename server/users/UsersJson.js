import Promise from 'bluebird'
import halson from 'halson'

export default class UsersJson {
  constructor ({userJson }) {
    this.userJson = userJson
  }

  render (users, { router }) {
    return Promise.map(users, user => this.userJson.render(user, { router }).get('content'))
      .then(userRepresentations => {
        return {
          type: 'halJson',
          content: halson({})
            .addEmbed('users', userRepresentations)
            .addLink('root', router.render('root'))
            .addLink('self', router.render('users'))
        }
      })
  }
}