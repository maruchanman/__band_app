import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LikeList from './LikeList.js';
import LivePage from './LivePage.js';
import BandPage from './BandPage.js';

const routeMapper = (props) => ({
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
    if (route.name == "BandPage") {
      return (
        <TouchableWithoutFeedback onPress={() => props.toggleLike(route.band.bandID)}>
          <Icon
            name="heart"
            size={20}
            color={props.likes.indexOf(route.band.bandID) != -1 ? "red" : "gray"}
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
    if (route.name == "LikeList") {
      return <LikeList navigator={navigator} likes={route.likes}/>
    } else if (route.name == "LivePage") {
      return <LivePage navigator={navigator} live={route.live}/>
    } else if (route.name == "BandPage") {
      return <BandPage navigator={navigator} band={route.band}/>
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'LikeList', likes: this.props.likes}}
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
