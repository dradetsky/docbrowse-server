const Promise = require('bluebird')
const os = require('os')
const path = require('path')
const keyBy = require('lodash/keyBy')
const mapValues = require('lodash/mapValues')
const sqlite3 = require('sqlite3')
Promise.promisifyAll(sqlite3)

// const docsetRoot = path.join(os.homedir(), '.docsets')
const docsetRoot = path.join(__dirname, 'docsets')

const docsets = [
  'marshmallow',
  'py3',
  'sqla'
]

class DocsetConfig {
  constructor (name) {
    this.dirname = `${name}.docset`
    this.dir = path.join(docsetRoot, this.dirname) 
    this.dbPath = path.join(this.dir, 'Contents/Resources/docSet.dsidx')
    this.docsPath = path.join(this.dir, 'Contents/Resources/Documents')
    this.uriBase = path.join('docsets', this.dirname, 'Contents/Resources/Documents')
    this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY)
  }
}

const dbs = mapValues(keyBy(docsets), (name) => new DocsetConfig(name))

const wordQuery = (word) => {
  let ps = mapValues(dbs, (config) => {
    let qry = `select type, name, path from searchIndex where name like '%${word}%' limit 10`
    let resP = config.db.allAsync(qry)
    let addExtraData = addExtraDataFn(config)
    return resP.then(addExtraData)
  })
  return Promise.props(ps)
}

const addExtraDataFn = (config) => {
  let fn = (results) => {
    return results.map((r) => {
      let link = path.join(config.uriBase, r.path)
      let flink = `file://${path.join(config.docsPath, r.path)}`

      r.flink = flink
      r.link = link
      return r
    })
  }
  return fn
}

const wordQueryHandler = (q, r) => {
  let word = q.params.word
  wordQuery(word).then((resobj) => {
    let out = JSON.stringify(resobj)
    r(out)
  })
}

const docsetRoute = {
  method: 'get',
  path: '/docsets/{param*}',
  handler: {
    directory: {
      path: docsetRoot
    }
  }
}

module.exports = {
  word: wordQueryHandler,
  docsetRoute: docsetRoute
}
