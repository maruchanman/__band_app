import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import LiveRow from './LiveRow.js';

export default class LikeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prefers: [],
      loading: true
    }
  }

  _loadPrefers() {
    var url = 'http://160.16.217.99/b/prefers';
    var data = new FormData()
    data.append("userID", DeviceInfo.getUniqueID())
    fetch(url, {
      method: "POST",
      body: data
    })
      .then((response) => response.json())
      .then((jsonData) => this.setState({prefers: jsonData, loading: false}))
  }

  componentDidMount() {
    this._loadPrefers()
  }

  componentWillReceiveProps(props) {
    this._loadPrefers()
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={this.state.loading ? styles.loading : styles.hidden}>
          <Icon style={styles.loadingText} name="spinner" size={40} color="gray"/>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        {this.state.prefers.map((live) => (
          <LiveRow live={live} key={live.liveID} push={this.props.navigator.push}/>
        ))}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
  },
  loading: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  hidden: {
    height: 0,
    opacity: 0
  },
  loadingText: {
    textAlign: 'center',
    color: 'gray',
    fontWeight: 'bold',
    height: 70,
    fontSize: 20
  }
});
