import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        <Text style={styles.description}>今後のライブ</Text>
        {this.state.schedules.map((live) => (
          <View style={styles.box}>
            <LiveRow live={live} key={live.liveID} push={this.props.navigator.push}/>
          </View>
        ))}
      </ScrollView>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: 'whitesmoke',
  },
  box: {
    margin: 5,
    padding: 5,
    backgroundColor: 'white'
  },
  image: {
    width: 200,
    height: 200
  },
  description: {
    color: 'dimgray',
    fontWeight: 'bold'
  }
});
