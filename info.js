const Promise = require('bluebird')
const _ = require('lodash')

const dbConf = require('./db-cfg')

const contentsSql = "select type, count(0) as n from searchIndex group by type order by type"

const contents = (db) => {
  return db.allAsync(contentsSql)
}

const allContents = () => {
  let ps = _.mapValues(dbConf.dbs, (config) => {
    return contents(config.db)
  })
  return Promise.props(ps)
}

const dbContentsHandler = (q, r) => {
  allContents().then(result => r(result))
}

const dbInfoHandler = (q, r) => {
  r(dbConf.options)
}

module.exports = {
  dbInfo: dbInfoHandler,
  dbContents: dbContentsHandler
}
