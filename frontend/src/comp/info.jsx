import React from 'react'
import map from 'lodash/map'

class DbInfo extends React.Component {
  render () {
    const configs = map(this.props.configs, (data, name) => {
      return (<h3>{name}</h3>)
    })

    return (
      <div style={{float: 'right'}}>
        <h2>DbInfo</h2>
        {configs}
      </div>
    )
  }
}

export { DbInfo }
