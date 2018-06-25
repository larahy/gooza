import bunyan from 'bunyan'
import Server from './Server'

const port = process.env.PORT || 8081;
const logLevel = process.env.LOG_LEVEL || 'info'
const mapboxToken = process.env.MAPBOX_TOKEN
const tokenSecret = process.env.TOKEN_SECRET

const log = bunyan.createLogger({
  name: 'server',
  level: logLevel
})
const server = new Server({
  port,
  log,
  mapboxToken,
  tokenSecret
})

server.onInitialisationComplete()
  .then(() => {
    log.info('Server initialisation complete.')
    server.listen()
  })
  .catch(error => {
    console.log(error)
  })
