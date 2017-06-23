import React from 'react'
import map from 'lodash/map'

class Stat extends React.Component {
  render () {
    return (
      <p style={{margin: 0}}>
        <b>{this.props.type}: </b>
        {this.props.n}
      </p>
    )
  }
}

class StatGroup extends React.Component {
  render () {
    const stats = this.props.data.map(elt => {
      const key = elt.type
      return <Stat key={key} type={elt.type} n={elt.n} />
    })
    return (
      <div style={{marginBottom: '10px'}}>
        <h3>
          {this.props.name}
        </h3>
        <div>
          {stats}
        </div>
      </div>
    )
  }
}

class DbInfo extends React.Component {
  render () {
    const configs = map(this.props.configs, (data, name) => {
      return <StatGroup key={name} data={data} name={name} />
    })

    return (
      <div style={{float: 'right'}}>
        {configs}
      </div>
    )
  }
}

export { DbInfo }
