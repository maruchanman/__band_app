import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';
import BandRow from './BandRow.js';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BandList extends React.Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds,
      bands: Object([]),
      loadCnt: 0,
      date: props.date,
      visibleRow: 0,
      loading: false
    }
  }

  _loadBands(date) {
    var url = 'http://localhost:9998/b/bands/' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + this.state.loadCnt;
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => this.setState({
        bands: this.state.bands.concat(responseData), loading: false}))
      .then(() => console.log(this.state.bands))
  }

  _onEndReached() {
    if(!this.state.loading) {
      this.setState(
        {loading: true, loadCnt: this.state.loadCnt + 1},
        this._loadBands(this.state.date)
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.ds.cloneWithRows(this.state.bands)}
          onEndReached={() => this._onEndReached()}
          onChangeVisibleRows={
            (visibleRows) => this.setState({
              visibleRow: Object.keys(visibleRows.s1)[0]})}
          renderRow={(rowData, sectionID, rowID) => (
            <BandRow
              key={rowData.bandID} band={rowData}
              push={this.props.navigator.push}
              play={this.state.visibleRow == rowID ? true : false}/>)}/>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30
  }
});
