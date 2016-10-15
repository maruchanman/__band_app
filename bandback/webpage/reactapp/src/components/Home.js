import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router';

export default class Home extends React.Component {
  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.row}>
          <Link to='/live' style={styles.buttonLink}>Go to Lives</Link>
        </div>
      </div>
    )
  }
}

var styles = {
  wrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: 10,
    backgroundImage: 'url(src/img/top.jpg)',
    backgroundSize: 'auto 100%',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    fontSize: 40,
  },
  row: {
    flexBasis: 500,
    textAlign: 'center',
  },
  buttonLink: {
    color: 'darkorange',
    border: 'solid 2px darkorange',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    margin: 0,
    padding: 40,
    textDecoration: 'none',
    fontWidth: 'bold',
  },
}
