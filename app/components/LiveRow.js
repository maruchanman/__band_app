import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
          onPress={() => this.props.push({name: "LivePage", live: this.props.live})}>
          <View style={styles.item}>
            <View style={styles.textBox}>
              <Text style={styles.liveHouse}>{this.props.live.name}</Text>
              <View style={styles.inline}>
                <Icon color="darkorange" size={14} name="map-marker"/>
                <Text style={styles.inlineText}>{this.props.live.prefacture}</Text>
                <Icon color="darkorange" size={14} name="calendar-o"/>
                <Text style={styles.inlineText}>{ymd}({w})</Text>
              </View>
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
    padding: 10,
    backgroundColor: 'white'
  },
  textBox: {
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  item: {
  },
  liveHouse: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  inline: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  inlineText: {
    marginHorizontal: 4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  act: {
    fontSize: 14,
    color: 'gray'
  }
});
