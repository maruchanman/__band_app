import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BandList from './BandList.js';
import LivePage from './LivePage.js';
import BandPage from './BandPage.js';

const routeMapper = props => ({
  LeftButton: (route, navigator, index, navState) => {
    if (route.name != "BandList" || route.date.getDate() != new Date().getDate()){
      return (
         <TouchableWithoutFeedback
          onPress={() => {
            var newDate = route.date;
            newDate.setDate(route.date.getDate() - 1);
            navigator.resetTo({name: "BandList", date: newDate})}}>
          <Icon name="chevron-left" size={20} color="gray" style={styles.icon}/>
        </TouchableWithoutFeedback>
      )
    }
  },
  RightButton: (route, navigator, index, navState) => {
    if (route.name == "BandList"){
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            var newDate = route.date;
            newDate.setDate(route.date.getDate() + 1);
            navigator.resetTo({name: "BandList", date: newDate})}}>
          <Icon name="chevron-right" size={20} color="gray" style={styles.icon}/>
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
    }
  },
  Title: (route, navigator, index, navState) => {
    if (route.date.getDate() == new Date().getDate()){
      return (<Text style={styles.title}>Today</Text>)
    } else if (route.date.getDate() == new Date().getDate() + 1) {
      return (<Text style={styles.title}>Tommorow</Text>)
    } else {
      return (<Text style={styles.title}>{((route.date.getYear() + 1900) + "." + route.date.getMonth() + 1) + "." + route.date.getDate()}</Text>)
    }
  }
});

export default class Search extends Component {

  renderScene(route, navigator) {
    if (route.name == "BandList") {
      return <BandList navigator={navigator} date={route.date}/>
    } else if (route.name == "LivePage") {
      return <LivePage navigator={navigator} live={route.live} color={route.color}/>
    } else if (route.name == "BandPage") {
      return <BandPage navigator={navigator} band={route.band}/>
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'BandList',
          date: new Date()
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
  title: {
    padding: 13,
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 14
  },
}
