const Hapi = require('hapi')
const inert = require('inert')
const query = require('./query.js')
const info = require('./info')
const merge = require('lodash/merge')

const server = new Hapi.Server()
server.connection({
  port: 3333,
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

server.route({
  method: 'GET',
  path: '/s/{msg}',
  config: {
    cors: true,
  },
  handler: query.search
})

server.route({
  method: 'GET',
  path: '/q/{msg}',
  config: {
    cors: true,
  },
  handler: (q, r) => {
    debugger
    r('ok\n')
  }
})

server.route({
  method: 'GET',
  path: '/info',
  handler: info.dbInfo
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
