import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import map from 'lodash/map'
import queryString from 'query-string'
import keyboardJS from 'keyboardjs'

// AFAICT, if I only import QueryResult, webpack doesn't see the
// others.
import { QueryResult, ResultGroup, ResultItem } from 'comps'

const inst = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
})

class Search extends React.Component {
  constructor () {
    super()
    this.state = {results: {}}
    this.handleTyping = this.handleTyping.bind(this)
  }
  componentDidMount () {
    this.host = window.origin
    let qry = queryString.parse(window.location.search)
    if (qry.q) {
      this.box.value = qry.q
      this.queryAndDisplay(qry.q)
    }
    keyboardJS.bind('ctrl + i', (e) => {
      if (this.box == document.activeElement) {
        this.box.blur()
      } else {
        this.box.focus()
      }
    })
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
  render () {
    return (
      <div>
        <input
          id='box'
          ref={(box) => { this.box = box }}
          type='text'
          onChange={this.handleTyping} />
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
