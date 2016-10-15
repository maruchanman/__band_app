import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import YouTube from 'react-native-youtube';

import BandTag from './BandTag.js';
import LiveRow from './LiveRow.js';

export default class BandPage extends React.Component {

  constructor() {
    super();
    this.state = {
      live: []
    }
  }  

  _loadLives() {
    fetch('http://ec2-52-197-250-11.ap-northeast-1.compute.amazonaws.com/schedule/' + this.props.data.bandID)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          live: responseData
        })
      })
      .done();
  }

  componentDidMount() {
    this._loadLives();
  }

  render() {

    const goToWebPage = (url) => Actions.webPage({url: url});
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.bandBox}>
          <TouchableWithoutFeedback onPress={() => goToWebPage(this.props.data.icon)}>
            <View>
              <BandTag data={this.props.data} />
            </View>
          </TouchableWithoutFeedback>
          <YouTube
            videoId={this.props.data.video}
            playsInline={true}
            loop={false}
            showinfo={false}
            style={styles.video}
          />
        </View>
        <View style={styles.scheduleBox}>
          {this.state.live.map(
            (live) => (<LiveRow key={live.liveID} rowData={live}/>)
          )}
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
  bandTag: {
    flex: 0,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 70,
    width: 70,
  },
  bandName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10
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
    height: 200
  },
  label: {
    fontSize: 18,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontWeight: 'bold'
  }
});
