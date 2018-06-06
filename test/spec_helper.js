const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const knex = require("knex")(config);
import bunyan from 'bunyan'
import path from 'path'
import fs from 'fs-extra'
import Server from '../server/Server'
const port = process.env.PORT || 8081
const mapboxToken = process.env.MAPBOX_TOKEN

const logDir = path.normalize(path.join(process.cwd(), 'run', 'logs'))
const logFile = path.normalize(path.join(logDir, 'component-tests.log'))


let server
export let log

before(done => {
  fs.ensureFileSync(logFile)

  log = bunyan.createLogger({
    name: 'component-tests',
    streams: [
      {
        level: 'debug',
        path: logFile
      }
    ]
  })

  server = new Server({
    port,
    log,
    mapboxToken
  })
  server.onInitialisationComplete()
    .tap(() => {
      log.info('Initialisation complete...')
      server.listen()
      done()
    })
    .catch(error => {
      log.info({ error }, 'Encountered error during initialisation.')
    })

})

after(() => {
  server.close()
  setTimeout(() => {
    process.exit(0)
  }, 1000)
})

beforeEach(() => {
  return server.onInitialisationComplete()
    .then(() => {
      log.info('Clearing all tables...')
      return knex.migrate.rollback()
        .then(() => {
          return knex.migrate.latest();
        })
        .then(() => {
          return knex.seed.run();
        })
        .catch(error => {
          console.log(error)
        });
    })
    .catch(error => {
      log.error({ error, stack: error.stack }, 'Encountered error during beforeEach.')
      throw error
    })
})
