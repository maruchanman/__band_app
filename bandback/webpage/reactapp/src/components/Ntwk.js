import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router';

export default class Ntwk extends React.Component {
  render() {
    return (
      <div style={styles.wrapper}>
        This is NtwkPage
      </div>
    )
  }
}

var styles = {
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
}
