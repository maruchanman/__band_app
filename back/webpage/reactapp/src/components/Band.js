import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router';

export default class Band extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      band: {},
    }
  }

  loadBand(bandID) {
    var url = `http://localhost:5000/band/${bandID}`;
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          band: responseData
        });
      })
  }

  componentDidMount() {
    this.loadBand(this.props.params.bandID);
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.box}>
          <h1>{this.state.band.name}</h1>
          <iframe src={`//www.youtube.com/embed/${this.state.band.video}?showinfo=0`} width="100%" height="500" frameborder="0"></iframe>
        </div>
        <div style={styles.box}>
        </div>
      </div>
    )
  }
}

var styles = {
  wrapper: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    padding: 20,
    flexDirection: 'column',
  },
  box: {
    backgroundColor: 'white',
    flex: 'none',
    width: '95%',
    margin: '0 auto',
    padding: 20,
  },
}
