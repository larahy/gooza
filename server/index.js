import bunyan from 'bunyan'
import Server from './Server'

const port = process.env.PORT || 8081;
const logLevel = process.env.LOG_LEVEL || 'info'
const log = bunyan.createLogger({
  name: 'server',
  level: logLevel
})
const server = new Server({
  port,
  log
})

server.onInitialisationComplete()
  .then(() => {
    log.info('Server initialisation complete.')
    server.listen()
  })
  .catch(error => {
    console.log(error)
  })
