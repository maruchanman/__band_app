import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TouchableWithoutFeedback
} from 'react-native';
import LiveList from './LiveList.js';
import LivePage from './LivePage.js';

export default class App extends Component {

  renderScene(route, navigator) {
    if (route.name == "LiveList") {
      return <LiveList navigator={navigator}/>
    } else if (route.name == "LivePage") {
      return <LivePage navigator={navigator} liveID={route.liveID}/>
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'LiveList'}}
        renderScene={this.renderScene}
      />
    )
  }

}
