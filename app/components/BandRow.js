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
        <View style={styles.videoBox}>
          <ActivityIndicator
            animating={true}
            size="large"
            style={this.state.ready ? styles.hidden : styles.loading}/>
          {this.props.play ? (
              <YouTube
                videoId={this.props.band.video}
                play={true}
                playsInline={true}
                fs={false}
                rel={true}
                hidden={!this.state.ready}
                showinfo={false}
                modestbranding={true}
                style={this.state.ready ? styles.video : styles.hidden}
                onReady={(e) => this.setState({ready: true})}/>) : null}
        </View>
        <View style={styles.infoBox}>
          <View style={styles.block}>
            <Text sytle={styles.bandName}>{this.props.band.name}</Text>
          </View>
          {this.props.band.house ? (
            <View style={styles.block}>
              <Text sytle={styles.bandName}>@{this.props.band.house}</Text>
            </View>) : null}
          <TouchableWithoutFeedback
            onPress={() => this.props.push({name: "BandPage", band: this.props.band})}>
            <View style={styles.block}>
              <Text sytle={styles.liveLink}>詳細>></Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    paddingTop: 20,
    marginBottom: 30,
    flex: 1,
    flexDirection: 'column',
    height: 420,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  bandName: {
    fontSize: 40
  },
  liveLink: {
    color: 'gray'
  },
  videoBox: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  infoBox: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    justifyContent: 'flex-start'
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 2
  },
  video: {
    flex: 1
  },
  hidden: {
    height: 0,
    width: 0,
    opacity: 0
  }
});
