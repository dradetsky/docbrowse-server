const Promise = require('bluebird')
const path = require('path')
const _ = require('lodash')
const sqlite3 = require('sqlite3')
const yaml = require('js-yaml')
const fs = require('fs')
Promise.promisifyAll(sqlite3)

// const docsetRoot = path.join(os.homedir(), '.docsets')
const docsetRoot = path.join(__dirname, 'docsets')

const docsetOpts = yaml.safeLoad(fs.readFileSync('cfg.yml'))

class DocsetConfig {
  constructor (name, opts) {
    const defaults = {
      dbName: 'docSet.dsidx',
      dirname: () => `${this.name}.docset`,
      dir: () => path.join(docsetRoot, this.dirname),
      dbDir: () => path.join(this.dir, 'Contents/Resources'),
      dbPath: () => path.join(this.dbDir, this.dbName),
      docsPath: () => path.join(this.dir, 'Contents/Resources/Documents'),
      uriBase: () => path.join('docsets', this.dirname, 'Contents/Resources/Documents'),
      db: () => new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY)
    }

    this.name = name
    for (let key in defaults) {
      if (_.has(opts, key)) {
        this[key] = opts[key]
      } else if (typeof(defaults[key]) === 'function') {
        this[key] = defaults[key].call(this)
      } else {
        this[key] = defaults[key]
      }
    }
  }
}

const dbs = _.mapValues(docsetOpts, (opts, name) => new DocsetConfig(name, opts))

module.exports = {
  dbs: dbs,
  docsetRoot: docsetRoot,
  options: docsetOpts,
}
