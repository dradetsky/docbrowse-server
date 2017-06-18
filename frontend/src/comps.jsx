import React from 'react'
import map from 'lodash/map'

class QueryResult extends React.Component {
  render () {
    let groups = map(this.props.groups, (group, key) => {
      return (<ResultGroup key={key} group={group} group_key={key} />)
    })
    return (<div style={this.props.styleCmd}>{groups}</div>)
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
        <em>{data.set} </em>
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

export { QueryResult, ResultGroup, ResultItem }
