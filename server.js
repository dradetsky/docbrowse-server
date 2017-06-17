const Hapi = require('hapi')
const inert = require('inert')
const query = require('./query.js')

const server = new Hapi.Server()
server.connection({
  port: 3000,
  host: 'localhost',
  routes: {
    cors: true
  }
})

server.route({
  method: 'GET',
  path: '/word/{word}',
  config: {
    cors: true
  },
  handler: query.word
})

server.register(inert, (err) => {
  if (err) {
    throw err
  }

  server.route(query.docsetRoute)

  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: 'frontend/public',
        index: true,
      }
    }
  });
})

server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})
