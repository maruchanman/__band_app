import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

export default class LiveRow extends React.Component {

  render() {

    var dateStr = String(this.props.live.yyyymmdd);
    var ymd = dateStr.slice(0, 4) + '/' + dateStr.slice(4, -2) + '/' + dateStr.slice(-2,);
    var date = new Date(ymd);
    var weeks = ["日", "月", "火", "水", "木", "金", "土"];
    var w = weeks[date.getDay()];

    return (
      <View style={styles.row}>
        <TouchableWithoutFeedback
          onPress={() => this.props.push({name: "LivePage", liveID: this.props.live.liveID})}>
          <View style={styles.item}>
            <Image source={{uri: this.props.live.image}} style={styles.image} />
            <View style={styles.textBox}>
              <Text style={styles.liveHouse}>{this.props.live.name}</Text>
              <Text style={styles.yyyymmdd}>{ymd}({w})</Text>
              {this.props.live.act.map((band) => (
                <Text key={band.bandID} style={styles.act}>{band.name}</Text>
              ))}
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
