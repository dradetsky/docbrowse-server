import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import map from 'lodash/map'
import queryString from 'query-string'

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
    let qry = queryString.parse(location.search)
    if (qry.q) {
      this.queryAndDisplay(qry.q)
    }
  }
  handleTyping (e) {
    let val = e.target.value
    this.queryAndDisplay(val)
  }
  queryAndDisplay (val) {
    let url = `http://localhost:3000/word/${val}`
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
          type='text'
          onChange={this.handleTyping} />
        <p>{this.state.inputText}</p>
        <QueryResult groups={this.state.results} />
      </div>
    )
  }
}

class QueryResult extends React.Component {
  render () {
    let groups = map(this.props.groups, (group, key) => {
      return (<ResultGroup key={key} group={group} group_key={key} />)
    })
    return (<div>{groups}</div>)
  }
}

class ResultGroup extends React.Component {
  render () {
    let group_key = this.props.group_key
    let items = this.props.group.map((data, idx) => {
      let key = `${group_key}_${idx}`
      return (<ResultItem key={key} data={data} />)
    })
    return (<div key={group_key}>{items}</div>)
  }
}

class ResultItem extends React.Component {
  explicit () {
    return (
      <span>
        <p>{this.props.data.type}</p>
        <p>{this.props.data.name}</p>
        <p>{this.props.data.path}</p>
      </span>
    )
  }

  clean () {
    let data = this.props.data
    return (
      <p>
        <strong>{data.type}: </strong>
        <a href={data.link}>{data.name}</a>
      </p>
    )
  }

  render () {
    // return this.explicit()
    return this.clean()
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
