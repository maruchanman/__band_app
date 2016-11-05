import React, { Component } from 'react';
import {
  View,
  Text,
  TabBarIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import Search from './Search.js';
import Like from './Like.js';

class TabIcon extends Component {
  render() {
    return (
      <Icon name="calendar" size={14} color="orange" />
    )
  }
}

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: "Search",
      likes: []
    }
    this.toggleLike = this.toggleLike.bind(this);
  }

  toggleLike(bandID) {
    var url = 'http://160.16.217.99/b/like';
    var data = new FormData()
    data.append("userID", DeviceInfo.getUniqueID())
    data.append("bandID", bandID)
    fetch(url, {
      method: "POST",
      body: data
    })
      .then((response) => {
        var newLikes = this.state.likes;
        if (this.state.likes.indexOf(bandID) == -1) {
          newLikes.push(bandID)
        } else {
          newLikes.splice(this.state.likes.indexOf(bandID), 1)
        }
        this.setState({likes: newLikes})
      })
  }

  _loadLikes() {
    var url = 'http://160.16.217.99/b/likes/' + DeviceInfo.getUniqueID();
    fetch(url)
      .then((response) => response.json())
      .then((jsonData) => this.setState({likes: jsonData}))
  }

  componentDidMount() {
    this._loadLikes()
  }

  render() {
    return (
      <TabBarIOS
        unselectedTabTintColor="gray"
        tintColor="darkorange"
        barTintColor="whitesmoke"
        style={styles.tabBar}
        >
        <Icon.TabBarItem
          title=""
          iconName="home"
          selected={this.state.selectedTab == 'Search'}
          onPress={() => {
            this.setState({
              selectedTab: 'Search'
            });
          }}
        >
          <Search toggleLike={this.toggleLike} likes={this.state.likes} />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title=""
          iconName="heart"
          selected={this.state.selectedTab == 'Like'}
          onPress={() => {
            this.setState({
              selectedTab: 'Like'
            });
          }}
        >
          <Like likes={this.state.likes} toggleLike={this.toggleLike}/>
        </Icon.TabBarItem>
      </TabBarIOS>
    )
  }

}

var styles = {
  tabBar: {
    backgroundColor: 'whitesmoke'
  }
}
