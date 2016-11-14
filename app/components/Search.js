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

const routeMapper = props => ({
  LeftButton: (route, navigator, index, navState) => {
    if (index == 0){
      return (
        <TouchableWithoutFeedback onPress={() => props.toggleModal("search")}>
          <Icon name="search" size={20} color="gray" style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    } else {
      return (
        <TouchableWithoutFeedback onPress={navigator.pop}>
          <Icon name="chevron-left" size={20} color="gray" style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    }
  },
  RightButton: (route, navigator, index, navState) => {
    if (index == 0){
      return (
        <TouchableWithoutFeedback onPress={() => props.toggleModal("calendar")}>
          <Icon name="calendar" size={20} color="gray" style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    } else if (route.name == "BandPage") {
      return (
        <TouchableWithoutFeedback onPress={() => props.toggleLike(route.band.bandID)}>
          <Icon
            name="heart"
            size={20}
            color={props.likes.indexOf(route.band.bandID) != -1 ? "#ff0000ff" : "gray"}
            style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    } else {
      return null
    }
  },
  Title: (route, navigator, index, navState) => {
    return null
  }
});

export default class Search extends Component {

  renderScene(route, navigator) {
    if (route.name == "LiveList") {
      return <LiveList navigator={navigator} date={route.date} {...route.passProps}/>
    } else if (route.name == "LivePage") {
      return <LivePage navigator={navigator} live={route.live}/>
    } else if (route.name == "BandPage") {
      return <BandPage navigator={navigator} band={route.band}/>
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'LiveList',
          date: new Date(),
          passProps: {
            toggleModal: this.props.toggleModal,
            visibleModal: this.props.visibleModal
          }
        }}
        renderScene={this.renderScene}
        style={styles.wrapper}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={routeMapper(this.props)}
            style={styles.navBar}
          />
        }
      />
    )
  }

}

const styles = {
  wrapper: {
    paddingTop: 60,
    paddingBottom: 50
  },
  navBar: {
    backgroundColor: 'whitesmoke',
  },
  icon: {
    padding: 10,
  },
}
