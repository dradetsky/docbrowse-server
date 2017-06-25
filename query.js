const Promise = require('bluebird')
const os = require('os')
const path = require('path')
const _ = require('lodash')

const dbConf = require('./db-cfg')

const queryConf = dbConf.options.querying

const mkPredicate = (words) => {
  let pattern = words.reduce((acc, w) => {
    return acc += `${w}%`
  }, '%')
  let expr = `where name like '${pattern}'`
  return expr
}

const mkSql = (words) => {
  let predicate = mkPredicate(words)
  let order = 'order by length(name), lower(name)'
  let limit = `limit ${queryConf.limit}`
  let qry = `select type, name, path from searchIndex ${predicate} ${order} ${limit}`
  return qry
}

const mkSubquerySql = (words) => {
  let fields = 'type, name, path'
  let order = 'order by length(name), lower(name)'
  let limit = `limit ${queryConf.limit}`
  let nestedQry = words.reduce((acc, w) => {
    let qry = `select ${fields} from (${acc}) where name like '%${w}%'`
    return qry
  }, 'searchIndex')
  return `${nestedQry} ${order} ${limit}`
}

const parQuery = (sql) => {
  let ps = _.mapValues(dbConf.dbs, (config) => {
    let addExtraData = addExtraDataFn(config)
    return config.db.allAsync(sql).then(addExtraData)
  })
  return Promise.props(ps)
}

const mergeQueries = (resObj) => {
  let results = _.flatten(_.values(resObj))
  let sorted = _.sortBy(results, [(r) => r.name.length, (r) => r.name])
  return {all: sorted}
}

const search = (words, type) => {
  let sql
  if (type == 'sub') {
    sql = mkSubquerySql(words)
  } else {
    sql = mkSql(words)
  }
  return parQuery(sql)
}

const addExtraDataFn = (config) => {
  let fn = (results) => {
    return results.map((r) => {
      let set = config.name
      let link = path.join(config.uriBase, r.path)
      let flink = `file://${path.join(config.docsPath, r.path)}`

      r.set = set
      r.flink = flink
      r.link = link
      return r
    })
  }
  return fn
}

const searchHandler = (q, r) => {
  let str = q.params.msg
  let type = q.query.type
  let merge = q.query.merge
  let words = str.split(/\s+/)
  search(words, type).then((resobj) => {
    let json
    if (merge) {
      json = mergeQueries(resobj)
    } else {
      json = resobj
    }
    let out = JSON.stringify(json)
    r(out)
  })
}

const docsetRoute = {
  method: 'get',
  path: '/docsets/{param*}',
  handler: {
    directory: {
      path: dbConf.docsetRoot
    }
  }
}

module.exports = {
  search: searchHandler,
  docsetRoute: docsetRoute
}

const test = () => {
  console.log(mkPredicate(['a']))
  console.log(mkPredicate(['a', 'b']))
  console.log(mkSql(['a']))
  console.log(mkSql(['a', 'b']))

  console.log(mkSql(['mes', 'pa']))
  console.log(mkSubquerySql(['mes', 'pa']))
}

if (require.main === module) {
    test();
}
