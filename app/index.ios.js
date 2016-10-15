
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import LiveList from './components/LiveList.js';
import LivePage from './components/LivePage.js';
import BandPage from './components/BandPage.js';
import WebPage from './components/WebPage.js';

class gigs extends Component {

  render() {

    let calendarIcon = () => (
      <TouchableWithoutFeedback onPress={() => Actions.modalCalendar()}>
        <Icon name='calendar' style={styles.button} color='gray' backgroundColor="whitesmoke" size={22}/>
      </TouchableWithoutFeedback>
    );
    let searchIcon = () => (
      <TouchableWithoutFeedback onPress={() => Actions.modalSearch()}>
        <Icon name='search' style={styles.button} color='gray' backgroundColor="whitesmoke" size={22}/>
      </TouchableWithoutFeedback>
    );
    let starIcon = () => (
      <TouchableWithoutFeedback>
        <Icon name='star-o' style={styles.button} color='gray' backgroundColor="whitesmoke" size={22}/>
      </TouchableWithoutFeedback>
    );

    return (
      <Router
        navigationBarStyle={styles.navBar}
        barButtonIconStyle={styles.barButtonIconStyle}
        titleStyle={styles.navTitle}
      >
        <Scene key="root">
          <Scene key="liveList" renderRightButton={calendarIcon} renderLeftButton={searchIcon} component={LiveList} title="" initial={true} />
          <Scene key="livePage" component={LivePage} renderRightButton={starIcon} title="" />
          <Scene key="bandPage" component={BandPage} renderRightButton={starIcon} title="" />
          <Scene key="webPage" component={WebPage} title="" />
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'whitesmoke',
    height: 70,
    borderBottomWidth: 0
  },
  navTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22
  },
  barButtonIconStyle: {
    tintColor: 'gray'
  },
  button: {
    margin: 2,
    padding: 0
  }
});

AppRegistry.registerComponent('gigs', () => gigs);
