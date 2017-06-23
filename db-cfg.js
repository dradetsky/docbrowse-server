const Promise = require('bluebird')
const path = require('path')
const _ = require('lodash')
const sqlite3 = require('sqlite3')
Promise.promisifyAll(sqlite3)

// const docsetRoot = path.join(os.homedir(), '.docsets')
const docsetRoot = path.join(__dirname, 'docsets')

const docsets = [
  'marshmallow',
  'py3',
  'sqla'
]

const altDbDir = path.join(docsetRoot, 'python')

const docsetOpts = {
  marshmallow: {},
  NodeJS: {},
  py3: {},
  sqla: {},
  flask: {
    dbName: 'flask.docSet.dsidx',
    dbDir: altDbDir,
    uriBase: path.join('docsets/python/flask')
  },
  alembic: {
    dbName: 'alembic.docSet.dsidx',
    dbDir: altDbDir,
    uriBase: path.join('docsets/python/alembic')
  },
  ansible: {
    dbName: 'ansible.docSet.dsidx',
    dbDir: altDbDir,
    uriBase: path.join('docsets/python/ansible')
  },
}

class DocsetConfig {
  constructor (name, opts) {
    this.name = name
    this.dbName = (opts.dbName ? opts.dbName : 'docSet.dsidx')
    this.dirname = `${name}.docset`
    this.dir = path.join(docsetRoot, this.dirname) 
    let defaultDbDir = path.join(this.dir, 'Contents/Resources')
    this.dbDir = (opts.dbDir ? opts.dbDir : defaultDbDir)
    this.dbPath = path.join(this.dbDir, this.dbName)
    this.docsPath = path.join(this.dir, 'Contents/Resources/Documents')
    let defaultUriBase = path.join('docsets', this.dirname, 'Contents/Resources/Documents')
    this.uriBase = (opts.uriBase ? opts.uriBase : defaultUriBase)
    this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY)
  }
}

const dbs = _.mapValues(docsetOpts, (opts, name) => new DocsetConfig(name, opts))

module.exports = {
  dbs: dbs,
  docsetRoot: docsetRoot,
  options: docsetOpts,
}
