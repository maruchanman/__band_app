import React, { Component } from 'react';
import {
  View,
  TabBarIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import Search from './Search.js';
import Like from './Like.js';


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: "Search",
      likes: [],
      visibleModal: {calendar: false, search: false}
    }
    this.toggleLike = this.toggleLike.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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

  toggleModal(modalName) {
    var visibleModal = this.state.visibleModal;
    visibleModal[modalName] = visibleModal[modalName] ? false : true;
    this.setState({visibleModal: visibleModal});
  }

  _loadLikes() {
    var url = 'http://160.16.217.99/b/likes/' + DeviceInfo.getUniqueID();
    fetch(url)
      .then((response) => response.json())
      .then((jsonData) => this.setState({likes: jsonData}))
  }

  changeTab(tabName) {
    this.setState({selectedTab: tabName})
  }

  componentDidMount() {
    this._loadLikes()
  }

  render() {
    return (
      <TabBarIOS
        unselectedTabTintColor="gray"
        tintColor="#ff0000"
        barTintColor="whitesmoke"
        style={styles.tabBar}
        >
        <Icon.TabBarItem
          title=""
          iconName="home"
          selected={this.state.selectedTab == 'Search'}
          onPress={() => this.changeTab("Search")}
        >
          <Search
            likes={this.state.likes}
            toggleLike={this.toggleLike}
            toggleModal={this.toggleModal}
            visibleModal={this.state.visibleModal}/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title=""
          iconName="heart"
          selected={this.state.selectedTab == 'Like'}
          onPress={() => this.changeTab("Like")}
        >
          <Like
            likes={this.state.likes}
            toggleLike={this.toggleLike}/>
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
