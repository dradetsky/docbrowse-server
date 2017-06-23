const dbConf = require('./db-cfg')

const dbInfoHandler = (q, r) => {
  r(dbConf.options)
}

module.exports = {
  dbInfo: dbInfoHandler
}
