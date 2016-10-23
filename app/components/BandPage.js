import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView
} from 'react-native';
import YouTube from 'react-native-youtube';
import LiveRow from './LiveRow.js';

export default class BandPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      schedules: []
    }
  }

  _loadSchedule(bandID) {
    var url = 'http://160.16.217.99/b/schedule/' + bandID;
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          schedules: responseData
        })
      })
  }

  componentDidMount() {
    this._loadSchedule(this.props.band.bandID)
  }

  render() {

    return (
      <ScrollView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.bandName}>{this.props.band.name}</Text>
          <YouTube
            videoId={this.props.band.video}
            playsInline={true}
            style={styles.video}/>
        </View>
        <View style={styles.box}>
          <Text style={{color: 'gray'}}>今後のライブ</Text>
          {this.state.schedules.map((live) => (
            <LiveRow live={live} key={live.liveID} push={this.props.navigator.push}/>
          ))}
        </View>
      </ScrollView>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'whitesmoke',
  },
  box: {
    margin: 5,
    padding: 10,
    backgroundColor: 'white'
  },
  icon: {
    height: 70,
    width: 70,
  },
  bandName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10
  },
  bandBox: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    padding: 5,
    backgroundColor: 'white'
  },
  scheduleBox: {
    margin: 5,
  },
  video: {
    flex: 1,
    minHeight: 200
  },
  label: {
    fontSize: 18,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontWeight: 'bold'
  }
});
