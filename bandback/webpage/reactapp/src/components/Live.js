import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

export default class Live extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      live: {act: []}
    }
  }

  loadLive(liveID) {
    var url = `http://localhost:5000/live/${liveID}`;
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({live: responseData})
      })
  }

  componentDidMount() {
    this.loadLive(this.props.params.liveID);
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.box}>
          <h1>{this.state.live.name}</h1>
          <ul style={styles.infolist}>
            <li style={styles.infos}>{this.state.live.open}</li>
            <li style={styles.infos}>{this.state.live.ticket}</li>
          </ul>
          <img src={this.state.live.image} style={styles.image}/>
          <p>{this.state.live.context}</p>
        </div>
        <div style={styles.box}>
          <ul>
            {this.state.live.act.map((band) => (
              <li><Link to={`/band/${band.bandID}`}>{band.name}</Link></li>
            ))}
          </ul>
        </div>
        <div style={styles.box}>
          <Link target="/blank" to={this.state.live.url}>情報元ページへ</Link>
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
  image: {
    width: '100%',
  },
  infolist: {
    display: 'flex',
    flex: 1,
  },
  infos: {
    flex: -1,
    marginRight: 20,
  },
}
