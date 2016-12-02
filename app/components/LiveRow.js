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

  getColor(pref) {
    if(pref == "東京"){
      return "#1253A4"
    } else if (pref == "大阪"){
      return "yellow"
    } else if (pref == "兵庫"){
      return "#DE4830"
    } else if (pref == "千葉"){
      return "yellowgreen"
    } else if (pref == "京都"){
      return "#0C555D"
    } else if (pref == "北海道"){
      return "green"
    } else if (pref == "神奈川"){
      return "#A6341F"
    } else if (pref == "茨城"){
      return "#C69D2B"
    } else{
      return "red"
    }
  }

  render() {

    var dateStr = String(this.props.live.yyyymmdd);
    var ymd = dateStr.slice(0, 4) + '/' + dateStr.slice(4, -2) + '/' + dateStr.slice(-2,);
    var date = new Date(ymd);
    var weeks = ["日", "月", "火", "水", "木", "金", "土"];
    var w = weeks[date.getDay()];
    var color = this.getColor(this.props.live.prefacture);

    return (
      <View style={styles.row}>
        <TouchableWithoutFeedback
          onPress={() => this.props.push({
            name: "LivePage", live: this.props.live, color: color})}>
          <View style={styles.item}>
            <View style={styles.textBox}>
              <Text style={styles.liveHouse}>{this.props.live.name}</Text>
              <View style={styles.inline}>
                <Icon color={color} size={7} name="circle" />
                <Icon color={color} size={7} name="circle" />
                <Icon color={color} size={7} name="circle" />
              </View>
              <View style={styles.inline}>
                <Icon color="gray" size={14} name="map-marker"/>
                <Text style={styles.inlineText}>{this.props.live.prefacture}</Text>
                <Icon color="gray" size={14} name="calendar-o"/>
                <Text style={styles.inlineText}>{ymd}({w})</Text>
              </View>
              {this.props.live.act.length > 0
                ? <Text style={styles.strong}>出演:</Text> : null
              }
              {this.props.live.act.map((band) => (
                <Text style={styles.act} key={band.bandID}>{band.name}</Text>
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
    minHeight: 110,
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
  },
  inline: {
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
  },
  bandMark: {
    fontSize: 12,
    color: "#ff0000"
  },
  strong: {
    color: 'gray',
    fontWeight: 'bold'
  },
});
