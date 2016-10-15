import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class LiveRow extends React.Component {

  render() {

    const goToLivePage = (liveData) => Actions.livePage({data: liveData});
    const icon = this.props.rowData.image;
    
    var dateStr = String(this.props.rowData.yyyymmdd);
    var ymd = dateStr.slice(0, 4) + '/' + dateStr.slice(4, -2) + '/' + dateStr.slice(-2,);
    var date = new Date(ymd);
    var weeks = ["日", "月", "火", "水", "木", "金", "土"];
    var w = weeks[date.getDay()];

    return (
      <View style={styles.row}>
        <TouchableWithoutFeedback onPress={() => goToLivePage(this.props.rowData)}>
          <View style={styles.item}>
            <Image source={{uri: icon}} style={styles.image} />
            <View style={styles.textBox}>
              <Text style={styles.liveHouse}>{this.props.rowData.name}</Text>
              <Text style={styles.yyyymmdd}>{ymd}({w})</Text>
              {this.props.rowData.act.map((band) => (<Text key={band.bandID} style={styles.act}>{band.name}</Text>))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    minHeight: 120,
    margin: 5,
    padding: 5,
    backgroundColor: 'white'
  },
  item: {
    flex: 1,
    flexDirection: 'row'
  },
  image: {
    height: 110,
    width: 110,
    resizeMode: 'cover'
  },
  textBox: {
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  liveHouse: {
    fontWeight: 'bold',
    fontSize: 16
  },
  yyyymmdd: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  act: {
    fontSize: 14,
    color: 'gray'
  }
});
