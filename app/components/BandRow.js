import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import YouTube from 'react-native-youtube';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BandRow extends React.Component {

  render() {
    return (
      <View
        style={styles.row}>
        <YouTube
          videoId={this.props.band.video}
          play={this.props.play}
          playsInline={true}
          fs={false}
          rel={true}
          controls={0}
          showinfo={false}
          modestbranding={true}
          style={styles.video}/>
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
    justifyContent: 'space-between'
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  video: {
    flex: 1,
    height: 300
  }
});
