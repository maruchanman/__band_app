import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LiveList from './LiveList.js';
import LivePage from './LivePage.js';
import BandPage from './BandPage.js';

const routeMapper = {
  LeftButton: (route, navigator, index, navState) => {
    if (index != 0){
      return (
        <TouchableWithoutFeedback onPress={navigator.pop}>
          <Icon name="chevron-left" size={20} color="gray" style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    } else {
      return null
    }
  },
  RightButton: (route, navigator, index, navState) => {
    if (index == 0){
      return (
        <TouchableWithoutFeedback onPress={() => navigator.replace({
            name: "LiveList", visible: route.visible ? false : true, date: route.date
          })
        }>
          <Icon name="calendar" size={20} color="gray" style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    } else {
      return null
    }
  },
  Title: (route, navigator, index, navState) => {
    return null
  }
};

export default class App extends Component {

  renderScene(route, navigator) {
    if (route.name == "LiveList") {
      return <LiveList navigator={navigator} visible={route.visible} date={route.date}/>
    } else if (route.name == "LivePage") {
      return <LivePage navigator={navigator} live={route.live}/>
    } else if (route.name == "BandPage") {
      return <BandPage navigator={navigator} band={route.band}/>
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'LiveList', visible: false, date: new Date()}}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={routeMapper}
            style={styles.navBar}
          />
        }
      />
    )
  }

}

const styles = {
  navBar: {
    backgroundColor: 'whitesmoke',
  },
  navBar: {
    backgroundColor: 'whitesmoke',
  },
  icon: {
    padding: 10,
  },
}
