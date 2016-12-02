import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BandRow from './BandRow.js';

export default class LivePage extends React.Component {

  render() {

    var dateStr = String(this.props.live.yyyymmdd);
    var ymd = dateStr.slice(0, 4) + '/' + dateStr.slice(4, -2) + '/' + dateStr.slice(-2,);
    var date = new Date(ymd);
    let weeks = ["日", "月", "火", "水", "木", "金", "土"];
    var w = weeks[date.getDay()];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.livehouse}>{this.props.live.name}</Text>
          <View style={styles.info}>
            <Icon color={this.props.color} size={7} name="circle" />
            <Icon color={this.props.color} size={7} name="circle" />
            <Icon color={this.props.color} size={7} name="circle" />
          </View>
          <View style={styles.info}>
            <Icon color="gray" size={14} name="map-marker"/>
            <Text style={styles.infoText}>{this.props.live.prefacture}</Text>
            <Icon color="gray" size={14} name="calendar-o"/>
            <Text style={styles.infoText}>{ymd}({w})</Text>
          </View>
          <View style={styles.info}>
            <Icon color="black" size={14} name="clock-o"/>
            <Text style={styles.infoText}>{this.props.live.open}</Text>
            <Icon color="black" size={14} name="jpy"/>
            <Text style={styles.infoText}>{this.props.live.ticket}</Text>
          </View>
          <Text style={{color: 'gray', fontWeight: 'bold'}}>出演:</Text>
          {this.props.live.act.map((band) => (
            <BandRow key={band.bandID} band={band} push={this.props.navigator.push}/>
          ))}
        </View>
        <View style={styles.box}>
          <Text style={{color: 'gray', fontWeight: 'bold'}}>詳細:</Text>
          <Text style={styles.context}>{this.props.live.context}</Text>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => Linking.openURL(this.props.live.url)}>
            <View style={styles.box}>
              <Text style={styles.link}>掲載元ページへ</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    )

  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
  },
  box: {
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'white'
  },
  livehouse: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginHorizontal: 4
  },
  context: {
    color: 'gray',
    fontSize: 14,
  },
  link: {
    paddingVertical: 10,
    fontSize: 14,
    alignSelf: 'center',
    color: 'gray'
  }
});
