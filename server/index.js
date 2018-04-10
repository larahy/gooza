// var restify = require('restify');
//
// function respond(req, res, next) {
//   res.send('hello ' + req.params.name);
//   next();
// }
//
// var server = restify.createServer();
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);
//
// server.listen(process.env.PORT || 8080, function() {
//   console.log('%s listening at %s', server.name, server.url);
// });

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
