import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image
} from 'react-native';
import YouTube from 'react-native-youtube';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BandRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {ready: false}
  }

  render() {
    return (
      <View
        style={styles.row}>
        <ActivityIndicator
          animating={true}
          size="large"
          style={this.state.ready ? styles.hidden : styles.loading}/>
        <YouTube
          videoId={this.props.band.video}
          play={this.props.play}
          playsInline={true}
          fs={false}
          rel={true}
          hidden={!this.state.ready}
          showinfo={false}
          modestbranding={true}
          style={this.state.ready ? styles.video : styles.hidden}
          onReady={(e) => this.setState({ready: true})}/>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    paddingTop: 30,
    marginVertical: 30,
    flex: 1,
    flexDirection: 'row',
    height: 420,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  video: {
    flex: 1,
    height: 300
  },
  hidden: {
    height: 0,
    width: 0,
    opacity: 0
  }
});
