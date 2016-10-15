import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router';

export default class LiveRow extends React.Component {

  render() {
    var live = this.props.live;
    return (
      <div style={styles.liveRow}>
        <Link to={`/live/${live.liveID}`} style={styles.link}/>
        <div style={styles.iconBox}>
          <img src={live.image != 'NULL'? live.image : './src/img/top.jpg'} style={styles.icon}/>
        </div>
        <div style={styles.info}>
          <h3>{live.name}</h3>
          {live.act.map((band) => (
            <p style={styles.band}>{band.name}</p>
          ))}
        </div>
      </div>
    )
  }
}

var styles = {
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
