import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import LiveRow from './LiveRow.js';

export default class LiveList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lives: [],
    }
  }

  _loadLives(date) {
    var url = 'http://160.16.217.99/b/lives/' + date.getFullYear() + '/' + (date.getMonth() - 1) + '/' + date.getDate();
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData[0]);
        this.setState({
          lives: responseData
        })
      })
  }

  componentDidMount() {
    this._loadLives(new Date());
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.lives.map((live) => (
          <LiveRow live={live} key={live.liveID} push={this.props.navigator.push}/>
        ))}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'whitesmoke',
  },
});
