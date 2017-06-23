import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import map from 'lodash/map'
import queryString from 'query-string'
import keyboardJS from 'keyboardjs'
import bindings from 'bind'

// AFAICT, if I only import QueryResult, webpack doesn't see the
// others.
import { QueryResult, ResultGroup, ResultItem, KeyHelp } from 'comps'
import { DbInfo } from 'comp/info'

const inst = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
})

class Search extends React.Component {
  constructor () {
    super()
    this.state = {
      results: {},
      showKeys: false,
      showDbInfo: true,
      dbInfo: {}
    }
    this.handleTyping = this.handleTyping.bind(this)
  }
  componentDidMount () {
    this.host = window.origin
    let qry = queryString.parse(window.location.search)
    if (qry.q) {
      this.box.value = qry.q
      this.queryAndDisplay(qry.q)
    }
    this.refreshDbInfo()
    for (let keySeq in bindings) {
      let cmdName = bindings[keySeq]
      let fn = this[cmdName]
      let cmd = fn.bind(this)
      keyboardJS.bind(keySeq, (e) => {
        cmd()
      })
    }
  }

  unboundKey () {
    console.log('unbound key')
  }

  cmdSwitchFocus () {
    if (this.box == document.activeElement) {
      this.box.blur()
    } else {
      this.box.focus()
    }
  }

  cmdShowKeys () {
    this.setState(prevState => ({
      showKeys: ! prevState.showKeys
    }))
  }

  cmdShowDbInfo () {
    if (!this.state.showDbInfo) {
      this.refreshDbInfo()
    }

    this.setState(prevState => ({
      showDbInfo: ! prevState.showDbInfo
    }))
  }

  handleTyping (e) {
    let val = e.target.value
    this.queryAndDisplay(val)
  }

  searchUrl (val, type, merge) {
    let param = val
    let url = `${this.host}/s/${param}?type=${type}&merge=${merge}`
    return url
  }

  queryAndDisplay (val) {
    let url = this.searchUrl(val, 'sub', 'merge')
    let cfg = {
      headers: {
        'Access-Control-Request-Origin': 'localhost'
      }
    }

    inst.get(url, cfg).then((res) => {
      this.setState({results: res.data})
    })
  }

  refreshDbInfo () {
    let url = `${this.host}/info`
    inst.get(url).then(res => {
      this.setState({dbInfo: res.data})
    })
  }

  render () {
    let keyHelp = null
    let dbInfo = null
    if (this.state.showKeys) {
      keyHelp = (<KeyHelp />)
    }
    if (this.state.showDbInfo) {
      dbInfo = (<DbInfo configs={this.state.dbInfo} />)
    }
    return (
      <div>
        <input
          id='box'
          ref={(box) => { this.box = box }}
          type='text'
          onChange={this.handleTyping} />
          {keyHelp}
          {dbInfo}
        <QueryResult groups={this.state.results} />
      </div>
    )
  }
}

class DualSearch extends Search {
  constructor () {
    super()
    this.state = {resultsL: {}, resultsR: {}}
  }

  queryAndDisplay (val) {
    let urlL = this.searchUrl(val, '')
    let urlR = this.searchUrl(val, 'sub')
    let cfg = {
      headers: {
        'Access-Control-Request-Origin': 'localhost'
      }
    }

    inst.get(urlL, cfg).then((res) => {
      this.setState({resultsL: res.data})
    })
    inst.get(urlR, cfg).then((res) => {
      this.setState({resultsR: res.data})
    })
  }

  render () {
    return (
      <div>
        <div style={{overflow: 'auto'}}>
        <input
          id='box'
          type='text'
          onChange={this.handleTyping} />
        </div>
        <QueryResult styleCmd={{float: 'left'}} groups={this.state.resultsL} />
        <QueryResult styleCmd={{float: 'right'}} groups={this.state.resultsR} />
      </div>
    )
  }
}

class App extends React.Component {
  render () {
    return (
      <Search />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
