import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import LiveRow from './LiveRow.js';

export default class LiveList extends React.Component {

  constructor() {
    super();
    this.state = {
      lives: [],
    }
  }

  loadLives(date) {
    var url = 'http://localhost:5000/lives/' + date.getFullYear() + '/' + (date.getMonth() + 1 - 1) + '/' + date.getDate();
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          lives: responseData
        });
      })
  }

  componentDidMount() {
    this.loadLives(new Date());
  }

  render() {
    return (
      <div style={styles.wrapper}>
        {this.state.lives.map((live) => (
          <LiveRow live={live}/>
        ))}
      </div>
    )
  }
}

var styles = {
  wrapper: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    padding: 10,
  },
  liveRow: {
    position: 'relative',
    margin: '0 auto',
    marginTop: '20',
    padding: 20,
    height: 300,
    width: '90%',
    backgroundColor: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  iconBox: {
    textAlign: 'center',
    flex: 'none',
    width: 350,
    height: 300,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: 'auto',
  },
  info: {
    flex: 'none',
    height: 300,
    padding: 30,
  },
  band: {
    margin: 0,
    paddingHorizontal: 20,
  },
}
