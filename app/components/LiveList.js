import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import LiveRow from './LiveRow.js';

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'whitesmoke',
  }
});

export default class LiveList extends React.Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds,
    }
  }
  
  _loadLives(date) {
    var url = 'http://ec2-52-197-250-11.ap-northeast-1.compute.amazonaws.com/lives/' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData)
        })
      })
      .done();
  }

  componentDidMount() {
    this._loadLives(new Date());
  }

  componentWillReceiveProps(props) {
    this._loadLives(props.date);
  }

  _renderRow(rowData) {
    return (
      <LiveRow rowData={rowData} />
    )
  }

  render() {

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        style={styles.container}
      />
    )
  }

}

